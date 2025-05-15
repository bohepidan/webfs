import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

const ResourceChart = ({ title, dataKey, data }) => {
    const [chartData, setChartData] = useState({ labels: [], values: [] });

    useEffect(() => {
        // 更新图表数据
        const labels = data.map(item => item.time);
        const values = data.map(item => item[dataKey]);
        setChartData({ labels, values });
    }, [data, dataKey]);

    const options = {
        title: { text: title },
        xAxis: { type: "category", data: chartData.labels },
        yAxis: { type: "value" },
        series: [
            {
                data: chartData.values,
                type: "line",
                smooth: true,
            },
        ],
    };

    return <ReactECharts option={options} style={{ height: 300, width: "100%" }} />;
};

export default ResourceChart;