hljs.initHighlightingOnLoad();

var colors = {
  blue: '#3F88C5',
  red: '#D00000',
  yellow: '#FFBA08',
  purple: '#731963',
  light: '#F4F6F7',
  dark: '#1d1c25',
  //gray: '#ff0000'
  gray: 'rgba(127,127,127,1)',
}

Chart.defaults.global.elements.line.borderWidth = 2;
Chart.defaults.global.elements.line.fill = false;
Chart.defaults.global.elements.line.tension = 0.35;
Chart.defaults.global.elements.point.radius = 0;
Chart.defaults.global.elements.point.borderWidth = 0;
Chart.defaults.global.defaultColor = colors['blue'];


var chartDict = {
  type: 'line',
  data: {
    labels: [1, 2, 3, 4, 5, 6, 7, 8],
    datasets: [
      {
        borderColor: colors.red,
        backgroundColor: colors.red,
        data: [1, 2, 4, -1, 3, 6, 2, 6],
      },
      {
        borderColor: colors.blue,
        backgroundColor: colors.blue,
        data: [1, 3, 5, 4, 4],
      },
    ],
  },
  options: {
    layout: {
      padding: {
        left: 8, right: 8, top: 8, bottom: 8,
      }
    },
    responsive: true,
    tooltips: { enabled: false },
    legend: { display: false },
    scales: {
      xAxes: [{
        gridLines: {
          color: colors.gray,
          drawOnChartArea: false,
          tickMarkLength: 8,
          zeroLineColor: colors.gray
        },
        ticks: {
          display: false,
        },
      }],
      yAxes: [{
        gridLines: {
          color: colors.gray,
          drawOnChartArea: false,
          tickMarkLength: 8,
          zeroLineColor: colors.gray,
        },
        ticks: {
          display: false,
          beginAtZero: true,
          suggestedMax: 7,
        }
      }]
    }
  }
};

var ctxLight = document.getElementById("myChartLight").getContext('2d');
var myChartLight = new Chart(ctxLight, chartDict);


var ctxDark = document.getElementById("myChartDark").getContext('2d');
var myChartDark = new Chart(ctxDark, chartDict);