const main = async () => {
  const res = await fetch('http://localhost:8080/test/series.json');
  const data = await res.json();
  Highcharts.chart('container', {
    title: {
      text: 'UV Index',
      align: 'left',
    },
    chart: {
      // type: 'spline',
    },
    yAxis: {
      title: {
        text: 'UV Index',
      },
    },

    xAxis: {
      type: 'datetime',
      labels: {
        formatter: (event) => {
          const label = new Date(data[event.value].date);
          return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
          }).format(label);
        },
      },
      // dateTimeLabelFormats: {
      //   // don't display the year
      //   month: '%e. %b',
      //   year: '%b',
      // },
    },

    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
    },

    series: [
      {
        name: 'UV Index',
        data: data.map((d) => [d.date, d.value]),
      },
    ],
  });
};

main().catch((err) => {
  console.error(err);
});
