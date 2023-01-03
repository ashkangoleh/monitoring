import client from "prom-client";

const register = new client.Registry();

const counter = new client.Counter({
  name: "test_counter",
  help: "test counter",
  labelNames: ["status"],
});

register.registerMetric(counter);

register.setDefaultLabels({
  app: "test",
});
const pushGateWay = new client.Pushgateway("http://arz.local:9191", {});

const tags = {
  jobName: "ashkan",
  appName: "ashkan",
};

setInterval(() => {
  (async () => {
    if (Math.random() < 10) {
      counter.inc(1, { status: "success" });
    } else {
      counter.inc(1, { status: "failed" });
    }
  })();
  pushGateWay.pushAdd(tags, (err) => {
    if (err) {
      console.log("error dad!");
    }
  });
}, 1000);
