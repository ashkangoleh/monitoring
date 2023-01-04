import client from "prom-client";

const register = new client.Registry();

const counter = new client.Counter({
  name: "test_counter",
  help: "test counter",
  labelNames: ["status"],
});
const counterGauge = new client.Gauge({
  name: "test_gauge",
  help: "test gauge",
  labelNames: ["status"],
});
register.registerMetric(counter);
register.registerMetric(counterGauge);

register.setDefaultLabels({
  app: "test",
});
const pushGateWay = new client.Pushgateway("http://arz.local:9191", {});

const tags = {
  jobName: "ashkan",
  appName: "ashkan",
};

const counter_test = async () => {
  const randomNumber = Math.floor(Math.random() * 51);
  if (randomNumber <= 20) {
    counter.inc({ status: "success" }, 1);
    counterGauge.inc({ status: "success" }, 1);
  } else if (randomNumber >= 20) {
    counter.inc({ status: "failed" });
    counterGauge.dec({ status: "failed" }, 1);
  }
};

setInterval(() => {
  counter_test();
  pushGateWay.pushAdd(tags, (err) => {
    if (err) {
      console.log("error dad!");
    }
  });
}, 1000);
