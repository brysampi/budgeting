import { Pie, PieChart, Tooltip, Legend } from 'recharts';

const defaultData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
];

const COLORS = ['#FFB22C', '#11d304', '#ff4c4c', '#0088FE'];

function CustomTooltip({ payload, label, active }) {
    if (active && payload && payload.length) {
        const dataPoint = payload[0];
        const name = dataPoint.name || (dataPoint.payload && dataPoint.payload.name) || 'Unknown';
        const value = dataPoint.value;

        return (
            <div className="custom-tooltip bg-[var(--color-theme-tertiary)] p-2 rounded shadow-lg border border-[var(--color-theme-important)]">
                <p className="label text-[var(--color-light)] font-bold">
                    {`${name} : ${value}`}
                </p>
            </div>
        );
    }

    return null;
}


export default function Rechart({ data = defaultData, isAnimationActive = true }) {
    const dataWithColors = data.map((entry, index) => ({
        ...entry,
        fill: COLORS[index % COLORS.length]
    }));

    return (
        <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
            <PieChart width={240} height={240}>
                <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: 'transparent' }}
                    wrapperStyle={{ outline: 'none' }}
                />
                <Pie
                    data={dataWithColors}
                    innerRadius="55%"
                    outerRadius="85%"
                    cornerRadius="0%"
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    isAnimationActive={isAnimationActive}
                />
            </PieChart>
        </div>
    );
}
