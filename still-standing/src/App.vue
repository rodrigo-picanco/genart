<template>
  <div>
    <h1>
      Evolução da proporção de casos casos de covid-19 confirmados no Brasil e
      pessoas recuperadas por dia.
    </h1>
    <p>
      Cada círculo branco representa o total dos casos confirmados até
      um dado dia a partir do primeiro dia com 100 casos confirmados. Os
      círculos verdes representam as pessoas recuperadas em relação a esse
      total.
    </p>

    <svg width="calc(100% - 200px)" :height="(recordDiameter * records.length) / 7 + 200">
      <g
        v-for="(record, index) in records"
        :key="index"
        :transform="
          `translate(${(index % 7) * recordDiameter}, ${Math.floor(index / 7) *
            recordDiameter}) `
        "
      >
        <g>
          <circle
            :cx="recordDiameter / 2"
            :cy="recordDiameter / 2"
            :r="recordDiameter / 2"
            fill="lightyellow"
          />
          <circle
            :cx="recordDiameter / 2"
            :cy="recordDiameter / 2"
            :r="(recordDiameter / 2) * record.recoveredSize"
            fill="lightgreen"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "App",
  data() {
    return {
      records: [],
      recordDiameter: (window.innerWidth - 200) / 7
    };
  },
  async mounted() {
    const rawData = await fetch(
      "https://api.covid19api.com/total/country/brazil"
    ).then(res => res.json());

    const formatedData = rawData
      .reverse()
      .filter(record => record.Confirmed > 100)
      .map(record => {
        const confirmedScale = d3.scaleLinear([0, record.Confirmed], [0, 1]);

        return {
          confirmedSize: record.Confirmed,
          recoveredSize: confirmedScale(record.Recovered)
        };
      });

    this.records = formatedData;
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  background: black;
  color: #fff;
}

h1,
p {
  margin-left: 100px;
  font-family: monospace;
}

h1 {
  margin-top: 100px;
}

svg {
  margin: 100px;
  overflow: visible;
}

svg circle {
  transform-origin: 0%;
  animation: breath 3s ease-in-out infinite;
}

@keyframes breath {
  0% {
    transform: scale(1.005);
  }

  25% {
    transform: scale(0.95);
  }

  100% {
    transform: scale(1.005);
  }
}
</style>
