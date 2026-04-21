const barColor = "#f3f3f3";
const trackBgColor = "#EBEBEB";
const primaryLight = "#A9A2F6";
const successLight = "#55DD92";
const warningLight = "#ffc085";

const textHeadingColor = "#5e5873";

const $productOrderChart = document.querySelector("#product-order-chart");
const $sessionChart = document.querySelector("#session-chart");

const sessionChartData = $sessionChart.getAttribute("data-chart");

if (sessionChartData) {
  const parseSessionChartData = JSON.parse(sessionChartData);

  const sessionChartOptions = {
    chart: {
      type: "donut",
      height: 250,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: true,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
        },
      },
    },
    series: parseSessionChartData.series,
    legend: { show: false },
    // comparedResult: [2, -3, 8],
    labels: parseSessionChartData.labels,
    stroke: { width: 0 },
    colors: [
      window.colors.solid.warning,
      window.colors.solid.primary,
      window.colors.solid.danger,
    ],
  };

  const sessionChart = new ApexCharts($sessionChart, sessionChartOptions);
  sessionChart.render();
}

const productOrderChartData = $productOrderChart.getAttribute("data-chart");

if (productOrderChartData) {
  const parseProductOrderChartData = JSON.parse(productOrderChartData);
  const total = parseProductOrderChartData?.series?.reduce(
    (accumulator, curr) => accumulator + curr
  );

  const series = parseProductOrderChartData?.series.map(s =>
    parseInt((s / total) * 100)
  );

  const orderChartOptions = {
    chart: {
      height: 300,
      type: "radialBar",
    },
    colors: [
      window.colors.solid.warning,
      window.colors.solid.success,
      window.colors.solid.danger,
    ],
    stroke: {
      lineCap: "round",
    },
    plotOptions: {
      radialBar: {
        size: 150,
        hollow: {
          size: "20%",
        },
        track: {
          strokeWidth: "100%",
          margin: 15,
          background: "#161E32",
        },
        dataLabels: {
          value: {
            fontSize: "1rem",
            color: textHeadingColor,
            fontWeight: "500",
            offsetY: 5,
          },
          total: {
            show: true,
            label: "Total",
            fontSize: "1.286rem",
            color: textHeadingColor,
            fontWeight: "500",

            formatter: function (w) {
              // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
              return total;
            },
          },
        },
      },
    },
    series: series,
    labels: parseProductOrderChartData.labels,
  };
  const orderChart = new ApexCharts($productOrderChart, orderChartOptions);
  orderChart.render();
}

// widgets

// const chartTransactionData =
//   lineAreaChartTransactionEl.getAttribute("data-series");

// const chartTransactionSeriesData = JSON.parse(chartTransactionData).map(
//   e => e.count
// );
// // const lineAreaChartTransactionOptions

// const lineAreaChartTransactionOptions = {
//   chart: {
//     height: 100,
//     type: "area",
//     toolbar: {
//       show: false,
//     },
//     sparkline: {
//       enabled: true,
//     },
//     grid: {
//       show: false,
//       padding: {
//         left: 0,
//         right: 0,
//       },
//     },
//   },
//   colors: [window.colors.solid.primary],
//   dataLabels: {
//     enabled: false,
//   },
//   stroke: {
//     curve: "smooth",
//     width: 2.5,
//   },
//   fill: {
//     type: "gradient",
//     gradient: {
//       shadeIntensity: 0.9,
//       opacityFrom: 0.7,
//       opacityTo: 0.5,
//       stops: [0, 80, 100],
//     },
//   },
//   series: [
//     {
//       name: "Transactions",
//       data: chartTransactionSeriesData,
//     },
//   ],
//   xaxis: {
//     labels: {
//       show: false,
//     },
//     axisBorder: {
//       show: false,
//     },
//   },
//   yaxis: [
//     {
//       y: 0,
//       offsetX: 0,
//       offsetY: 0,
//       padding: { left: 0, right: 0 },
//     },
//   ],
//   tooltip: {
//     x: { show: false },
//   },
// };

// const lineAreaChartTransaction = new ApexCharts(
//   lineAreaChartTransactionEl,
//   lineAreaChartTransactionOptions
// );
// lineAreaChartTransaction.render();
