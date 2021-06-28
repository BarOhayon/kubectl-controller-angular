const util = require('util');
let child_process = require('child_process');
let axios = require('axios');
const exec = util.promisify(require('child_process').exec);

var spawn = require('child_process').spawn;

async function runCommandOneTimeCommand(cmd) {
    const { stdout, stderr } = await exec(cmd, { maxBuffer: 1024 * 5000, });
    if (stderr) {
        throw new Error(stderr);
    }
    return stdout;
}

async function runCommandLongCommand(cmd) {
    let res = child_process.exec(cmd);
    return res;
}

async function getNamespaces() {
    let res = await runCommandOneTimeCommand('kubectl get namespaces');
    let lines = res.split('\n');
    lines.splice(0, 1);
    let namespaces = lines.filter(l => l !== '').map(l => l.split(/[ ]+/)).map((l, ind) => { return { name: l[0], status: l[1], age: l[2], _id: ind } });
    return namespaces;
}

async function getPods(namespace, extraData) {
    try {

        let res = await runCommandOneTimeCommand(`kubectl get pods -n ${namespace}`);
        let res2 = JSON.parse(await runCommandOneTimeCommand(`kubectl get pods -n ${namespace} -o json`));

        let lines = res.split('\n');
        lines.splice(0, 1);
        let podsData = lines.filter(l => l !== '').map(l => l.split(/[ ]+/)).map((line, index) => {
            let [name, ready, status, restarts, age] = line;
            let displayName = name.split('-').slice(0, -1).join('-');
            if (extraData && extraData.removeNamePrefix) {
                displayName = displayName.replace(extraData.removeNamePrefix, '');
            }
            let podIndex = name.split('-').pop();
            return {
                _id: index.toString(),
                name,
                displayName,
                index: podIndex,
                ready,
                status,
                restarts,
                age
            };
        });
        return podsData;
    } catch (error) {
        // console.error('getPods', { msg: error.message });
        throw error;
    }

}

async function getLogs(namespace, pod) {
    let res = await runCommandOneTimeCommand(`kubectl logs ${pod} -n ${namespace} --tail=200`);
    let lines = res.split('\n').map(l => l.replace(/\[([0-9;])*m/g, "").replace(new RegExp("", 'g'), ""));
    return lines;
}

async function getConfig(namespace, pod) {
    try {
        let podPort = await getPort(namespace, pod);
        let handler = await portForwarding(namespace, pod, 3001, podPort);
        await new Promise(resolve => setTimeout(resolve, 1000));
        let result = await axios({
            method: 'get',
            url: `http://localhost:3001/info/config`,
        });
        await killCmdCall(handler.pid);
        return result.data;
    }
    catch (err) {
        console.error(err);
        return undefined;
    }
}
var portForwardPidMap = {};

async function portForwarding(namespace, pod, localPort, podPort) {
    let id = `${namespace}_${pod}`;
    if (portForwardPidMap[id]) {
        killCmdCall(portForwardPidMap[id]);
        portForwardPidMap[id] = undefined;
    };
    let res = await runCommandLongCommand(`kubectl port-forward ${pod} --namespace ${namespace} ${localPort}:${podPort}`);
    portForwardPidMap[id] = res.pid;
    return res;
}

async function getPort(namespace, pod) {
    try {
        let res = await runCommandOneTimeCommand(`kubectl describe pod ${pod} -n ${namespace}`);
        let port = res.match(/\s*Port:\s*([0-9]*)\/TCP/)[1];
        return port
    }
    catch (err) {
        console.error(err);
    }
}

async function killCmdCall(pid) {
    spawn("taskkill", ["/pid", pid, '/f', '/t']);
    for (let key in portForwardPidMap) {
        if (portForwardPidMap[key] === Number(pid)) {
            portForwardPidMap[key] = undefined
        }
    }
}

module.exports = {
    getNamespaces,
    getPods,
    getLogs,
    portForwarding,
    killCmdCall,
    getConfig,
    getPort
};