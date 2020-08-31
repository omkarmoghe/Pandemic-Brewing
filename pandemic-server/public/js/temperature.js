window.onload = () => {
  let canvas = document.getElementById("temp-chart");
  const chart = new Chart(canvas, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Temperature",
          data: [
            {
              t: "2020-08-31",
              y: 100
            },
            {
              t: "2020-09-01",
              y: 79
            }
          ]
        }
      ]
    },
    options: {
      scales: {
        xAxes: [
          {
            type: "time",
          }
        ],
        yAxes: [
          {
            display: true,
            labelString: "Temp (F)"
          }
        ]
      }
    }
  });
};
