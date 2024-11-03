import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale, Filler } from 'chart.js';
import parseDataToChartData from '../../services/parseDataToChartData';
import { ApiDataItem } from '../../services/parseDataToChartData';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale, Filler);

type ElectricityPriceChartProps = {
    apiDataItem: ApiDataItem;
    countryName: string;
};

const ElectricityPriceChart: React.FC<ElectricityPriceChartProps> = ({ apiDataItem, countryName }) => {
    const chartRef = useRef(null);
    const chartData = parseDataToChartData(apiDataItem, countryName);

    // Параметри з градієнтом для графіку
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `€${tooltipItem.raw}`
                }
            },
            // Додавання градієнтного фону
            beforeDraw: (chart) => {
                const ctx = chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, chart.height!);
                gradient.addColorStop(0, 'rgba(230, 122, 172, 0.4)'); // Початок градієнту
                gradient.addColorStop(1, 'rgba(230, 122, 172, 0)'); // Кінець градієнту

                chartData.datasets[0].backgroundColor = gradient;
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time of Day',
                },
            },
            y: {
                title: {
                    display: true,
                    text: apiDataItem.unit,
                },
            },
        },
        elements: {
            line: {
                fill: true, // Активуємо заливку під лінією графіка
            }
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
            <Line ref={chartRef} data={chartData} options={options} />
        </div>
    );
};

export default ElectricityPriceChart;