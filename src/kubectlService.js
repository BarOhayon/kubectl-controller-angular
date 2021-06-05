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
    console.log(`getNamespaces`);
    let res = await runCommandOneTimeCommand('kubectl get namespaces');
    let lines = res.split('\n');
    lines.splice(0, 1);
    let namespaces = lines.filter(l => l !== '').map(l => l.split(/[ ]+/)).map((l, ind) => { return { name: l[0], status: l[1], age: l[2], _id: ind } });
    console.log({ namespaces });
    return namespaces;
}

async function getPods(namespace) {
    let res = await runCommandOneTimeCommand(`kubectl get pods -n ${namespace}`);
    let lines = res.split('\n');
    lines.splice(0, 1);
    let podsData = [];
    for (let line of lines) {
        let data = line.split(' ').filter(l => l !== '');
        if (!data.length) {
            continue;
        }
        let displayName = data[0].split('-')[1].length < 3 ? data[0] : data[0].split('-')[0]

        podsData.push({
            name: data[0],
            displayName: displayName.replace('dataplatform', ''),
            ready: data[1],
            status: data[2],
            restarts: data[3],
            age: data[4]
        });
    }
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

// getNamespaces().then(console.log);
// getPods('bar').then(r => {
//     console.log(r);    
// });
// getLogs('bar', "projects-69f794d449-5vxf5").then(r => {
//     console.log(r);    
// });
// portForwarding('bar', 'mongodb-667bf47db6-6rvwh', '27018', '27017').then(cp => {
//     console.log(`port forwarding`);
//     killCmdCall(cp);
// });