<template>
  <div class="visits-page">
    <h1 class="page-title">Hate Crime Map</h1>
    <b-row>
      <b-col lg="12">
        <Widget
          title="<h5><strong>Incidents by States</strong></h5>"
          customHeader
        >
          <div class="bg-transparent" style="align: center">
            <Map style="width: 80%" />
          </div>
        </Widget>
      </b-col>
    </b-row>
    <b-row>
      <b-col xl="10" xs="12">
        <Widget
          title="<h5><strong>Incidents History</strong></h5>"
          customHeader
        >
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
        </Widget>
      </b-col>
    </b-row>
    <b-row>
      <b-col xl="10" xs="12">
        <Widget title="<h5><strong>Incidents</strong></h5>" customHeader>
          <div class="table-resposive">
            <table class="table">
              <thead>
                <tr>
                  <th class="hidden-sm-down">#</th>
                  <th>Picture</th>
                  <th>Description</th>
                  <th class="hidden-sm-down">Info</th>
                  <th class="hidden-sm-down">Date</th>
                  <th class="hidden-sm-down">Size</th>
                  <th class="hidden-sm-down">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in tableStyles" :key="row.id">
                  <td>{{ row.id }}</td>
                  <td>
                    <img
                      class="img-rounded"
                      :src="row.picture"
                      alt=""
                      height="50"
                    />
                  </td>
                  <td>
                    {{ row.description }}
                    <div v-if="row.label">
                      <b-badge :variant="row.label.colorClass">{{
                        row.label.text
                      }}</b-badge>
                    </div>
                  </td>
                  <td>
                    <p class="mb-0">
                      <small>
                        <span class="fw-semi-bold">Type:</span>
                        <span class="text-muted"
                          >&nbsp; {{ row.info.type }}</span
                        >
                      </small>
                    </p>
                    <p>
                      <small>
                        <span class="fw-semi-bold">Dimensions:</span>
                        <span class="text-muted"
                          >&nbsp; {{ row.info.dimensions }}</span
                        >
                      </small>
                    </p>
                  </td>
                  <td class="text-muted">
                    {{ parseDate(row.date) }}
                  </td>
                  <td class="text-muted">
                    {{ row.size }}
                  </td>
                  <td class="width-150">
                    <b-progress
                      :variant="row.progress.colorClass"
                      :value="row.progress.percent"
                      :max="100"
                      class="progress-sm mb-xs"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="clearfix">
            <div class="float-right">
              <b-button variant="default" class="mr-3" size="sm"
                >Send to...</b-button
              >
              <b-dropdown
                variant="inverse"
                class="mr-xs"
                size="sm"
                text="Clear"
                right
              >
                <b-dropdown-item>Clear</b-dropdown-item>
                <b-dropdown-item>Move ...</b-dropdown-item>
                <b-dropdown-item>Something else here</b-dropdown-item>
                <b-dropdown-divider />
                <b-dropdown-item>Separated link</b-dropdown-item>
              </b-dropdown>
            </div>
            <p>Basic table with styled content</p>
          </div>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Vue from "vue";
import Widget from "@/components/Widget/Widget";
import Map from "./components/Map/Map";
import AreaChart from "./components/AreaChart/AreaChart";
import AnimatedNumber from "animated-number-vue";
import config from "../../config";
const colors = config.colors;

export default {
  name: "Visits",
  components: {
    Map,
    Widget,
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
              },
            },
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
              },
            },
          },
        },
      },
      tableStyles: [
        {
          id: 1,
          picture: require("../../assets/tables/1.jpg"), // eslint-disable-line global-require
          description: "Palo Alto",
          info: {
            type: "JPEG",
            dimensions: "200x150",
          },
          date: new Date("September 14, 2018"),
          size: "45.6 KB",
          progress: {
            percent: 29,
            colorClass: "success",
          },
        },
        {
          id: 2,
          picture: require("../../assets/tables/2.jpg"), // eslint-disable-line global-require
          description: "The Sky",
          info: {
            type: "PSD",
            dimensions: "2400x1455",
          },
          date: new Date("November 14, 2018"),
          size: "15.3 MB",
          progress: {
            percent: 33,
            colorClass: "warning",
          },
        },
        {
          id: 3,
          picture: require("../../assets/tables/3.jpg"), // eslint-disable-line global-require
          description: "Down the road",
          label: {
            colorClass: "danger",
            text: "INFO!",
          },
          info: {
            type: "JPEG",
            dimensions: "200x150",
          },
          date: new Date("September 14, 2018"),
          size: "49.0 KB",
          progress: {
            percent: 38,
            colorClass: "inverse",
          },
        },
        {
          id: 4,
          picture: require("../../assets/tables/4.jpg"), // eslint-disable-line global-require
          description: "The Edge",
          info: {
            type: "PNG",
            dimensions: "210x160",
          },
          date: new Date("September 15, 2018"),
          size: "69.1 KB",
          progress: {
            percent: 17,
            colorClass: "danger",
          },
        },
        {
          id: 5,
          picture: require("../../assets/tables/5.jpg"), // eslint-disable-line global-require
          description: "Fortress",
          info: {
            type: "JPEG",
            dimensions: "1452x1320",
          },
          date: new Date("October 1, 2018"),
          size: "2.3 MB",
          progress: {
            percent: 41,
            colorClass: "primary",
          },
        },
      ],
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
    parseDate(date) {
      const dateSet = date.toDateString().split(" ");
      return `${date.toLocaleString("en-us", { month: "long" })} ${
        dateSet[2]
      }, ${dateSet[3]}`;
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
