import { Pie, PieChart, Tooltip } from 'recharts';

const defaultData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
];

// Generate dynamic colors based on data length
const generateColors = (count) => {
    const colors = [];
    // Get the primary yellow color from CSS variables
    const primaryYellow = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-theme-important').trim() || '#FFB22C';

    for (let i = 0; i < count; i++) {
        if (i === 0) {
            // First color is always the primary yellow
            colors.push(primaryYellow);
        } else {
            // Generate random vibrant colors for the rest
            const hue = Math.floor(Math.random() * 360);
            const saturation = 70 + Math.floor(Math.random() * 20); // 70-90%
            const lightness = 50 + Math.floor(Math.random() * 15); // 50-65%
            colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
        }
    }
    return colors;
};

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

const CustomLegend = ({ data, colors }) => {
    return (
        <div className="flex flex-wrap justify-center gap-3 mt-4 px-2">
            {data.map((entry, index) => (
                <div
                    key={`legend-${index}`}
                    className="flex items-center gap-2 bg-[var(--color-theme-secondary)] px-3 py-2 rounded-lg border border-[var(--color-theme-tertiary)] hover:border-[var(--color-theme-important)] transition-colors duration-200"
                >
                    <div
                        className="w-3 h-3 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: colors[index] }}
                    />
                    <span className="text-[var(--color-light)] text-xs font-medium whitespace-nowrap">
                        {entry.name}
                    </span>
                    <span className="text-[var(--color-theme-tertiary-light)] text-xs">
                        ({entry.value.toLocaleString()})
                    </span>
                </div>
            ))}
        </div>
    );
};

export default function Rechart({ data = defaultData, isAnimationActive = false }) {
    // Generate dynamic colors based on data length
    const colors = generateColors(data.length);

    const dataWithColors = data.map((entry, index) => ({
        ...entry,
        fill: colors[index]
    }));

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-2">
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
            <CustomLegend data={data} colors={colors} />
        </div>
    );
}
