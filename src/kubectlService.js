const util = require('util');
let child_process = require('child_process');
let axios = require('axios');
const exec = util.promisify(require('child_process').exec);

var spawn = require('child_process').spawn;

async function runCommandOneTimeCommand(cmd) {
    const { stdout } = await exec(cmd, { maxBuffer: 1024 * 1000 });
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
    let res = await runCommandOneTimeCommand(`kubectl get pods -n ${namespace}`);
    let lines = res.split('\n');
    lines.splice(0, 1);
    let podsData = lines.filter(l => l !== '').map(l => l.split(/[ ]+/)).map((line, index) => {
        let [name, ready, status, restarts, age] = line;
        if (extraData.removeNamePrefix) {
            name = name.replace(extraData.removeNamePrefix, '');
        }
        let podIndex = name.split('-')[1];
        return {
            _id: index.toString(),
            name,
            displayName: name.split('-')[0],
            index: podIndex,
            ready,
            status,
            restarts,
            age
        };
    });
    return podsData;
}

async function getLogs(namespace, pod) {
    let res = await runCommandOneTimeCommand(`kubectl logs ${pod} -n ${namespace} --tail=200`);
    let lines = res.split('\n').map(l => l.replace(/\[([0-9;])*m/g, "").replace(new RegExp("", 'g'), ""));
    return lines;
}

async function getConfig(namespace, pod) {
    let podPort = await getPort(namespace, pod);
    let handler = await portForwarding(namespace, pod, 3001, podPort);
    try {

        let result = await axios({
            method: 'get',
            url: `http://localhost:3001/info/config`,
        });
        return result.data;
    }
    catch (err) {
        console.error(err);
        return undefined;
    }
    finally {
        await killCmdCall(handler.pid);
    }
}

async function portForwarding(namespace, pod, localPort, podPort) {
    let res = await runCommandLongCommand(`kubectl port-forward ${pod} --namespace ${namespace} ${localPort}:${podPort}`);
    return res;
}

async function getPort(namespace, pod) {
    try {
        let res = await runCommandOneTimeCommand(`kubectl describe pod ${pod} -n ${namespace}`);
        let port = res.match(/\s*Port:\s*([0-9]*)\/TCP/)[1];
        return port
    }
    catch (err) {
        console.log(err);
    }
}

async function killCmdCall(pid) {
    spawn("taskkill", ["/pid", pid, '/f', '/t']);
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