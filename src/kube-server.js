const cors = require('cors');
const express = require('express')
const app = express();
app.use(cors());
app.options('*', cors());
const port = 6810;
const kubectlService = require('./kubectlService');

app.get('/namespaces', async (req, res) => {
    let ns = await kubectlService.getNamespaces();
    res.json(ns);
    res.end();
});

app.get('/pods', async (req, res) => {
    let ns = req.query.namespaceName;
    let extradata = {};
    extradata.removeNamePrefix = req.query.removeNamePrefix;
    try {
        let pods = await kubectlService.getPods(ns, extradata);
        res.json(pods);
        res.end();
    } catch (error) {
        console.error(error);
        res.send(error.message, 500)
    }
});

app.get('/logs', async (req, res) => {
    let ns = req.query.namespaceName;
    let pod = req.query.podName;
    let logs = await kubectlService.getLogs(ns, pod);
    res.json(logs);
    res.end();
});

app.get('/config', async (req, res) => {
    let ns = req.query.namespaceName;
    let pod = req.query.podName;
    let config = await kubectlService.getConfig(ns, pod);
    res.json(config);
    res.end();
});

app.get('/connectToMongo', async (req, res) => {
    let ns = req.query.namespaceName;
    let pods = await kubectlService.getPods(ns);
    let mongoPod = pods.find(p => p.name.startsWith('mongo'));
    let cp = await kubectlService.portForwarding(ns, mongoPod.name, '27018', '27017');
    console.log('connectToMongo', { pid: cp.pid });
    res.json({ status: 'connected', pid: cp.pid });
    res.end();
});

app.get('/disconnectFromMongo', async (req, res) => {
    let pid = req.query.pid;
    console.log('disconnectFromMongo', { pid });
    await kubectlService.killCmdCall(pid);
    res.json({ status: 'disconnected' });
    res.end();
});

app.get('/openPortForwarding', async (req, res) => {
    let ns = req.query.namespace;
    let pod = req.query.pod;
    let podPort = await kubectlService.getPort(ns, pod);
    let cp = await kubectlService.portForwarding(ns, pod, '3001', podPort);
    res.json({ status: 'connected', pid: cp.pid });
    res.end();
});

app.get('/closePortForwarding', async (req, res) => {
    let pid = req.query.pid;

    await kubectlService.killCmdCall(Number(pid));
    res.json({ status: 'disconnected' });
    res.end();
});
process.env.KUBECONFIG = ''
app.listen(port, () => console.log(`kube-server ${port}!`))
app.use(express.static('public'))