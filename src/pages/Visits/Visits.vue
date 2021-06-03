<template>
  <div class="visits-page">
    <h1 class="page-title">Hate Crime Map</h1>
    <b-row>
      <b-col lg="12">
        <div class="bg-transparent" style="align:center">
          <Map style="width: 80%" />
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col xl="12" xs="12">
        <div id="wrapper">
          <div id="chart-line2">
            <apexchart
              type="line"
              height="250"
              :options="incidentData.chartOptions"
              :series="incidentData.series"
            ></apexchart>
          </div>
          <div id="chart-line">
            <apexchart
              type="area"
              height="150"
              :options="incidentData.chartOptionsLine"
              :series="incidentData.seriesLine"
            ></apexchart>
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="10" xs="12">
        <div>
          <h6>Incidents</h6>
          <div class="widget-body p-0">
            <div class="list-group list-group-lg">
              <a class="list-group-item" href="#">
                <span class="thumb-sm float-left mr">
                  <img
                    class="rounded-circle"
                    src="../../assets/people/a2.jpg"
                    alt="..."
                  />
                  <i class="status status-bottom bg-success" />
                </span>
                <div>
                  <h6 class="m-0">Chris Gray</h6>
                  <p class="help-block text-ellipsis m-0">
                    Hey! What&apos;s up? So many times since we
                  </p>
                </div>
              </a>
              <a class="list-group-item" href="#">
                <span class="thumb-sm float-left mr">
                  <img
                    class="rounded-circle"
                    src="../../assets/people/a4.jpg"
                    alt="..."
                  />
                  <i class="status status-bottom bg-success" />
                </span>
                <div>
                  <h6 class="m-0">Jamey Brownlow</h6>
                  <p class="help-block text-ellipsis m-0">
                    Good news coming tonight. Seems they agreed to proceed
                  </p>
                </div>
              </a>
              <a class="list-group-item" href="#">
                <span class="thumb-sm float-left mr">
                  <img
                    class="rounded-circle"
                    src="../../assets/people/a1.jpg"
                    alt="..."
                  />
                  <i class="status status-bottom bg-primary" />
                </span>
                <div>
                  <h6 class="m-0">Livia Walsh</h6>
                  <p class="help-block text-ellipsis m-0">
                    Check my latest email plz!
                  </p>
                </div>
              </a>
              <a class="list-group-item" href="#">
                <span class="thumb-sm float-left mr">
                  <img
                    class="rounded-circle"
                    src="../../assets/people/a5.jpg"
                    alt="..."
                  />
                  <i class="status status-bottom bg-danger" />
                </span>
                <div>
                  <h6 class="m-0">Jaron Fitzroy</h6>
                  <p class="help-block text-ellipsis m-0">
                    What about summer break?
                  </p>
                </div>
              </a>
            </div>
          </div>
          <footer class="bg-widget mt">
            <input
              type="search"
              class="form-control form-control-sm"
              placeholder="Search"
            />
          </footer>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Vue from "vue";
import Map from "./components/Map/Map";
import AreaChart from "./components/AreaChart/AreaChart";
import AnimatedNumber from "animated-number-vue";
import config from "../../config";
const colors = config.colors;

export default {
  name: "Visits",
  components: {
    Map,
    AreaChart,
    AnimatedNumber,
  },
  data() {
    const data = [
      [1276920000000, 34],
      [1308456000000, 43],
      [1340078400000, 31],
      [1371614400000, 43],
      [1403150400000, 33],
      [1487116800000, 52],
    ];
    return {
      animateNumberOptions: {
        duration: 2000,
        easing: "easeInQuad",
        formatValue(value) {
          return value.toFixed(0);
        },
      },
      checkedArr: [false, false, false],
      dataCollection: null,
      incidentData: {
        series: [
          {
            data: data,
          },
        ],
        chartOptions: {
          chart: {
            id: "chart2",
            type: "line",
            height: 250,
            toolbar: {
              autoSelected: "pan",
              show: false,
            },
          },
          colors: ["#FFFFFF"],
          stroke: {
            width: 2,
          },
          dataLabels: {
            enabled: false,
          },
          fill: {
            opacity: 1,
          },
          markers: {
            size: 0,
          },
          xaxis: {
            type: "datetime",
            labels: {
              style: {
                colors: colors.chartTextColor,
                fontSize: "14px",
              },
            },
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
            
          },
          yaxis: {
            labels: {
              style: {
                colors: colors.chartTextColor,
              }
            }
          },
          grid: {
            borderColor: colors.gridLineColor,
          },
        },

        seriesLine: [
          {
            data: data,
          },
        ],
        chartOptionsLine: {
          chart: {
            id: "chart1",
            height: 150,
            type: "area",
            brush: {
              target: "chart2",
              enabled: true,
            },
            selection: {
              enabled: true,
              xaxis: {
                min: new Date("19 Jun 2010").getTime(),
                max: new Date("14 Aug 2017").getTime(),
                labels: {
                  style: {
                    colors: colors.chartTextColor,
                    fontSize: "14px",
                  },
                },
              },
            },
          },
          colors: ["#FFFFFF"],
          fill: {
            type: "gradient",
            gradient: {
              opacityFrom: 0.91,
              opacityTo: 0.1,
            },
          },
          xaxis: {
            type: "datetime",
            tooltip: {
              enabled: true,
            },
          },
          yaxis: {
            labels: {
              style: {
                colors: colors.chartTextColor,
              }
            }
          },
        },
      },
    };
  },
  methods: {
    checkTable(id) {
      let arr = [];
      if (id === 0) {
        const val = !this.checkedArr[0];
        for (let i = 0; i < this.checkedArr.length; i += 1) {
          arr[i] = val;
        }
      } else {
        arr = this.checkedArr;
        arr[id] = !arr[id];
      }
      if (arr[0]) {
        let count = 1;
        for (let i = 1; i < arr.length; i += 1) {
          if (arr[i]) {
            count += 1;
          }
        }
        if (count !== arr.length) {
          arr[0] = !arr[0];
        }
      }
      Vue.set(this, "checkedArr", arr);
    },

    fillData() {
      this.dataCollection = {
        labels: [
          this.getRandomInt(),
          this.getRandomInt(),
          this.getRandomInt(),
          this.getRandomInt(),
          this.getRandomInt(),
          this.getRandomInt(),
          this.getRandomInt(),
        ],
        datasets: [
          {
            label: "Data One",
            backgroundColor: "#1870DC",
            borderColor: "transparent",
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
            ],
          },
          {
            label: "Data Two",
            backgroundColor: "#F45722",
            borderColor: "transparent",
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
            ],
          },
        ],
      };
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },
  },
  mounted() {
    this.fillData();
  },
};
</script>

<style src="./Visits.scss" lang="scss" />
