import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import axios from 'axios'

const CARD_COLORS = [
    { bg: 'from-purple-600 to-purple-800', icon: '📊' },
    { bg: 'from-blue-600 to-blue-800', icon: '📈' },
    { bg: 'from-pink-600 to-pink-800', icon: '⚠️' },
    { bg: 'from-green-600 to-green-800', icon: '✅' },
]

const PIE_COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#06b6d4', '#84cc16']

export default function Dashboard({ data, onReset }) {
    const { profile, charts, insights, filters, filter_options } = data
    const [selectedFilters, setSelectedFilters] = useState({})
    const [chatQuestion, setChatQuestion] = useState('')
    const [chatAnswer, setChatAnswer] = useState('')
    const [chatLoading, setChatLoading] = useState(false)
    const [apiKey, setApiKey] = useState('')
    const [selectedModel, setSelectedModel] = useState('gemini-pro')
    const [apiConfigured, setApiConfigured] = useState(false)

    const handleFilterChange = async (column, value) => {
        const newFilters = { ...selectedFilters, [column]: value }
        setSelectedFilters(newFilters)

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/filter`, {
                data_id: profile.data_id,
                filters: newFilters
            })
            // Update charts with filtered data
            console.log('Filtered:', response.data)
        } catch (error) {
            console.error('Filter failed:', error)
        }
    }

    const handleChat = async () => {
        if (!chatQuestion.trim()) return
        if (!apiConfigured || !apiKey) {
            setChatAnswer('⚠️ Please configure your Gemini API key first!')
            return
        }

        setChatLoading(true)
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
                question: chatQuestion,
                data_id: profile.data_id,
                api_key: apiKey,
                model: selectedModel
            })
            setChatAnswer(response.data.answer)
        } catch (error) {
            setChatAnswer('Unable to process question. Please check your API key and try again.')
        }
        setChatLoading(false)
    }

    const exportToPDF = async () => {
        const dashboard = document.getElementById('dashboard-content')

        // Hide filters temporarily for cleaner PDF
        const filtersSection = document.getElementById('filters-section')
        const originalDisplay = filtersSection ? filtersSection.style.display : ''
        if (filtersSection) filtersSection.style.display = 'none'

        const canvas = await html2canvas(dashboard, {
            backgroundColor: '#0a0e27',
            scale: 1.5,
            logging: false,
            useCORS: true,
            allowTaint: true,
            windowWidth: 1400,
            windowHeight: dashboard.scrollHeight
        })

        // Restore filters
        if (filtersSection) filtersSection.style.display = originalDisplay

        const imgData = canvas.toDataURL('image/png', 1.0)
        const pdf = new jsPDF('l', 'mm', 'a4') // Landscape for better fit
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        const imgWidth = pdfWidth
        const imgHeight = (canvas.height * pdfWidth) / canvas.width

        // Single page - scale to fit
        if (imgHeight <= pdfHeight) {
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
        } else {
            // If too tall, fit to page height
            const scaledWidth = (canvas.width * pdfHeight) / canvas.height
            const xOffset = (pdfWidth - scaledWidth) / 2
            pdf.addImage(imgData, 'PNG', xOffset, 0, scaledWidth, pdfHeight)
        }

        pdf.save(`${profile.filename}_dashboard.pdf`)
    }

    const renderChart = (chart, idx) => {
        const chartColor = chart.color || '#8b5cf6'

        if (chart.type === 'line') {
            return (
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={chart.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                        />
                        <Line type="monotone" dataKey="value" stroke={chartColor} strokeWidth={3} dot={{ fill: chartColor }} />
                    </LineChart>
                </ResponsiveContainer>
            )
        }

        if (chart.type === 'pie') {
            return (
                <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                        <Pie
                            data={chart.data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={90}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chart.data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                    </PieChart>
                </ResponsiveContainer>
            )
        }

        return (
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chart.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                    />
                    <Bar dataKey="value" fill={chartColor} radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        )
    }

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-space-dark via-gray-900 to-space-dark">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-star-yellow mb-2">⭐ {profile.filename}</h1>
                        {profile.s3_url && (
                            <p className="text-sm text-green-400">☁️ Stored in AWS S3</p>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={exportToPDF}
                            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg font-semibold transition-all shadow-lg"
                        >
                            📥 Export PDF
                        </button>
                        <button
                            onClick={onReset}
                            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-semibold transition-all shadow-lg"
                        >
                            🔄 New Upload
                        </button>
                    </div>
                </div>

                <div id="dashboard-content">
                    {/* KPI Cards - Power BI Style */}
                    <div className="grid grid-cols-4 gap-5 mb-8">
                        {[
                            { label: 'Total Rows', value: profile.rows.toLocaleString(), idx: 0 },
                            { label: 'Columns', value: profile.columns, idx: 1 },
                            { label: 'Missing Values', value: profile.column_info.reduce((sum, col) => sum + col.missing, 0), idx: 2 },
                            { label: 'Completeness', value: `${(100 - (profile.column_info.reduce((sum, col) => sum + col.missing, 0) / (profile.rows * profile.columns) * 100)).toFixed(1)}%`, idx: 3 }
                        ].map((card) => (
                            <div
                                key={card.idx}
                                className={`bg-gradient-to-br ${CARD_COLORS[card.idx].bg} p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/10`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-white/80 text-sm font-medium">{card.label}</p>
                                    <span className="text-3xl">{CARD_COLORS[card.idx].icon}</span>
                                </div>
                                <p className="text-4xl font-bold text-white">{card.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    {filters && filters.length > 0 && filter_options && (
                        <div id="filters-section" className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl mb-8 border border-gray-700">
                            <h3 className="text-lg font-semibold mb-3 text-star-yellow">🔍 Filters</h3>
                            <div className="flex gap-4 flex-wrap">
                                {filters.map((filter) => (
                                    filter_options[filter] && (
                                        <div key={filter} className="flex flex-col">
                                            <label className="text-sm text-gray-400 mb-1">{filter}</label>
                                            <select
                                                onChange={(e) => handleFilterChange(filter, e.target.value)}
                                                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                                            >
                                                <option value="">All</option>
                                                {filter_options[filter].map((option) => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Charts Grid */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        {charts.map((chart, idx) => (
                            <div
                                key={idx}
                                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-gray-700 hover:border-purple-500 transition-all"
                            >
                                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: chart.color }}></span>
                                    {chart.title}
                                </h3>
                                {renderChart(chart, idx)}
                            </div>
                        ))}
                    </div>

                    {/* Insights */}
                    <div className="grid grid-cols-1 gap-6 mb-8">
                        {insights.map((insight, idx) => (
                            <div
                                key={idx}
                                className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-gray-700"
                            >
                                <h2 className="text-2xl font-bold mb-4 text-star-yellow">{insight.title}</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    {insight.items.map((item, i) => (
                                        <div
                                            key={i}
                                            className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 hover:border-purple-500 transition-all"
                                        >
                                            <p className="text-gray-200">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Chat - Hidden */}
            </div>
        </div>
    )
}
