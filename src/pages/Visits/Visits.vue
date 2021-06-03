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
            <Map style="width: 80%" :stats=mapStats />
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
                type="bar"
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
              <tbody>
                <tr v-for="row in incidentList" :key="row.id">
                  <td>
                    {{ formatDate(row.incident_time) }}
                  </td>
                  <td>
                    {{ row.incident_location }}
                  </td>
                  <td>
                    <a :href=row.url target="_blank" :title=row.abstract >{{ row.title }}</a>
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
import axios from "axios";
import moment from 'moment'
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
    const data = [];
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
        mapStats:{},
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
            type: "bar",
            brush: {
              target: "chart2",
              enabled: true,
            },
            selection: {
              enabled: true,
              xaxis: {
                // min: new Date("19 Jun 2010").getTime(),
                // max: new Date("14 Aug 2017").getTime(),
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
      incidentList: [
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
    formatDate(dateString){ //format to mm/dd/yyyy
      return moment(String(dateString)).format('MM/DD/YYYY')
    },
    fillData() {
      axios.get(config.api_endpoint+"/incidents")
          .then((response) => {
            this.incidentList = response.data.incidents
          })
      axios.get(config.api_endpoint+"/stats")
          .then((response) => {
            const dailyCountSeries = []
            const monthlyCountSeries = []
            let currMonth=0
            let monthTotal = 0
            response.data.stats.forEach(dailyCount => {
              dailyCountSeries.push([moment(String(dailyCount.key)).format(), dailyCount.value])
              const month = moment(String(dailyCount.key)).startOf('month').format()
              if (currMonth==0) {
                currMonth=month
              }
              if (currMonth == month ) {
                monthTotal += dailyCount.value
              }
              else {
                monthlyCountSeries.push([currMonth, monthTotal])
                currMonth = month
                monthTotal = dailyCount.value
              }
            });
            if ( 0!=currMonth){
              monthlyCountSeries.push([currMonth, monthTotal])
            }
            this.incidentData.series =  [
                  {
                    data: dailyCountSeries,
                  },
            ]
            this.incidentData.seriesLine = [
                  {
                    data: monthlyCountSeries,
                  },
            ]
            //Data to populate map
            /* 
            mapData: [
              { state: NY,
                date_range: "Mar 2018 - Sep 2020",
                total: 123
              }
            ]
            */ 
            this.mapStats = {"total":response.data.total}
          })
    } //fillData
  },
  mounted() {
    this.fillData();
  },
};
</script>

<style src="./Visits.scss" lang="scss" />
