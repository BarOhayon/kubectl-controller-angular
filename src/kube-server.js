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
    let ns = req.query.namespace;
    let pods = await kubectlService.getPods(ns);
    res.json(pods);
    res.end();
});

app.get('/logs', async (req, res) => {
    let ns = req.query.namespace;
    let pod = req.query.pod;
    let logs = await kubectlService.getLogs(ns, pod);
    res.json(logs);
    res.end();
});

app.get('/config', async (req, res) => {
    let ns = req.query.namespace;
    let pod = req.query.pod;
    let config = await kubectlService.getConfig(ns, pod);
    res.json(config);
    res.end();
});

app.get('/connectToMongo', async (req, res) => {
    let ns = req.query.namespace;
    let pods = await kubectlService.getPods(ns);
    let mongoPod = pods.find(p => p.name.startsWith('mongo'));
    let cp = await kubectlService.portForwarding(ns, mongoPod.name, '27018', '27017');
    res.json({ status: 'connected', pid: cp.pid });
    res.end();
});

app.get('/disconnectFromMongo', async (req, res) => {
    let pid = req.query.pid;

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

    await kubectlService.killCmdCall(pid);
    res.json({ status: 'disconnected' });
    res.end();
});

app.listen(port, () => console.log(`kube-server ${port}!`))
app.use(express.static('public'))