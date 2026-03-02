import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import Dashboard from '../components/Dashboard'

export default function Home() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0]
        setLoading(true)

        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, formData)
            setData(response.data)
        } catch (error) {
            console.error('Upload failed:', error)
        }
        setLoading(false)
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/csv': ['.csv'], 'application/vnd.ms-excel': ['.xlsx'] }
    })

    if (data) {
        return <Dashboard data={data} onReset={() => setData(null)} />
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="max-w-2xl w-full">
                <h1 className="text-5xl font-bold text-center mb-4 text-star-yellow">
                    ⭐ StellaDash
                </h1>
                <p className="text-center text-gray-400 mb-12">
                    Data Intelligence Command Center
                </p>

                <div
                    {...getRootProps()}
                    className={`border-4 border-dashed rounded-lg p-16 text-center cursor-pointer transition-all ${isDragActive ? 'border-star-yellow bg-space-blue/20' : 'border-gray-600 hover:border-gray-400'
                        }`}
                >
                    <input {...getInputProps()} />
                    {loading ? (
                        <p className="text-xl">Processing...</p>
                    ) : (
                        <>
                            <p className="text-2xl mb-4">📊</p>
                            <p className="text-xl mb-2">Drop your CSV or Excel file here</p>
                            <p className="text-gray-500">or click to browse</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
