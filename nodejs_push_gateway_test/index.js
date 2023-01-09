import client from "prom-client";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),winston.format.json()
  ),
  defaultMeta: { service: "PushGateWay" },
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: "error.log", level: "error" }),
    // new winston.transports.File({ filename: "info.log", level: "info" }),
    // new winston.transports.File({ filename: "debug.log", level: "debug" }),
    // new winston.transports.File({ filename: "warn.log", level: "warn" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});


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
const pushGateWay = new client.Pushgateway(
  "http://arz.local:9191",
  {},
  register
);

const tags = {
  jobName: "ashkan",
  appName: "ashkan",
};

const counter_test = async () => {
  const randomNumber = Math.floor(Math.random() * 51);
  if (randomNumber <= 30) {
    logger.info(`${randomNumber}`);
    counter.inc({ status: "success" }, 1);
    counterGauge.inc({ status: "success" }, 1);
  } else if (randomNumber > 30) {
    logger.error(`${randomNumber}`);
    counter.remove({ status: "success" }, 1);
    counterGauge.dec({ status: "success" }, 1.5);
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

// class x {
//   constructor(time) {
//     this.time = time;
//     this.register = new client.Registry();
//     this.counter = new client.Counter();
//     this.gateway = new client.Pushgateway();
//     setInterval(() => {
//       counter_test();
//       this.gateway.pushAdd(tags, (err) => {
//         if (err) {
//           console.log("error dad!");
//         }
//       });
//     }, this.time);
//   }
// }
