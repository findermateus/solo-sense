import { useEffect, useState } from 'react'

interface HumidityData {
    id: number;
    status: string;
    value: number;
    analyzedAt: string;
}

const HUMIDITY_LABELS = {
    inAir: "No Ar",
    drySoil: "Solo Seco",
    slightlyMoist: "Levemente Úmido",
    moist: "Úmido",
    waterSubmerged: "Submerso em Água",
};

function App() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [humidityData, setHumidityData] = useState<HumidityData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    const getStatusLabel = (status: string): string => {
        return HUMIDITY_LABELS[status as keyof typeof HUMIDITY_LABELS] || status;
    };

    const fetchHumidityData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/humidity`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setHumidityData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Falha ao buscar dados de umidade');
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/humidity`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await fetchHumidityData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Falha ao limpar histórico');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHumidityData();

        const interval = setInterval(() => {
            fetchHumidityData();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const currentReading = humidityData[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-agro-green-50">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Monitor de Umidade
                    </h1>
                    <p className="text-gray-600">Sistema de monitoramento em tempo real</p>
                </div>

                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={fetchHumidityData}
                        disabled={loading}
                        className="flex items-center gap-2 bg-agro-green-600 hover:bg-agro-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {loading ? 'Carregando...' : 'Atualizar'}
                    </button>
                    <button
                        onClick={clearHistory}
                        disabled={loading}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Limpar Histórico
                    </button>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd" />
                            </svg>
                            <p className="text-red-700 font-medium">Erro: {error}</p>
                        </div>
                    </div>
                )}

                {currentReading && (
                    <div className="mb-8">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-agro-green-600 to-agro-green-700 px-6 py-4">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Status Atual
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-agro-green-50 rounded-xl">
                                        <div className="text-sm text-agro-green-600 font-medium mb-1">CONDIÇÃO</div>
                                        <div className="text-xl font-bold text-agro-green-800">
                                            {getStatusLabel(currentReading.status)}
                                        </div>
                                    </div>
                                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                                        <div className="text-sm text-blue-600 font-medium mb-1">VALOR</div>
                                        <div className="text-xl font-bold text-blue-800">
                                            {currentReading.value}
                                            <span className="text-sm text-blue-600 ml-1">(0-1023)</span>
                                        </div>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                                        <div className="text-sm text-purple-600 font-medium mb-1">ÚLTIMA ANÁLISE</div>
                                        <div className="text-lg font-bold text-purple-800">
                                            {formatDate(currentReading.analyzedAt)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Histórico de Dados
                        </h2>
                    </div>
                    <div className="p-6">
                        {humidityData.length === 0 && !loading ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="text-gray-500 text-lg">Nenhum dado de umidade disponível</p>
                                <p className="text-gray-400 text-sm mt-2">Os dados aparecerão aqui quando houver
                                    leituras</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {humidityData.map((reading, index) => (
                                    <div
                                        key={reading.id}
                                        className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${index === 0
                                            ? 'border-agro-green-200 bg-agro-green-50'
                                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-agro-green-500' : 'bg-gray-400'
                                                    }`}></div>
                                                <div>
                                                    <div className={`font-semibold text-lg ${index === 0 ? 'text-agro-green-800' : 'text-gray-700'
                                                        }`}>
                                                        {getStatusLabel(reading.status)}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Valor: {reading.value}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-sm font-medium ${index === 0 ? 'text-agro-green-600' : 'text-gray-600'
                                                    }`}>
                                                    {formatDate(reading.analyzedAt)}
                                                </div>
                                                {index === 0 && (
                                                    <div className="text-xs text-agro-green-500 font-medium mt-1">
                                                        MAIS RECENTE
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App