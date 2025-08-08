import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  CloudSun,
  Sprout,
  MessageCircle,
  Calendar as CalendarIcon,
  TrendingUp,
  Leaf,
  Droplets,
  Thermometer,
  Wind,
  Search,
  DollarSign,
} from "lucide-react";

interface Crop {
  id: number;
  name: string;
  category: string;
  pricePerKg: number;
  currency: string;
  season: string;
  growthDuration: string;
}

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
      };
    }>;
  };
}

export default function Index() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<Crop[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch crops data
  useEffect(() => {
    fetch("/api/crops")
      .then((res) => res.json())
      .then((data) => {
        setCrops(data.crops);
        setFilteredCrops(data.crops);
      })
      .catch((err) => console.error("Error fetching crops:", err));
  }, []);

  // Fetch weather data
  useEffect(() => {
    fetch("/api/weather?location=New York") // Default location
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((err) => console.error("Error fetching weather:", err));
  }, []);

  // Filter crops based on search
  useEffect(() => {
    const filtered = crops.filter(
      (crop) =>
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.category.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredCrops(filtered);
  }, [searchTerm, crops]);

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatInput }),
      });

      const data = await response.json();
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-xl">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  FarmAdvisor
                </h1>
                <p className="text-sm text-gray-600">
                  Smart Agriculture Solutions
                </p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-green-600"
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-green-600"
              >
                Analytics
              </Button>
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-green-600"
              >
                Reports
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Smart Farm Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get real-time weather updates, crop prices, farming advice, and plan
            your agricultural activities with our AI-powered platform.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Weather Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                Weather Forecast
              </CardTitle>
              <CloudSun className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              {weather ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">
                      {weather.location.name}
                    </h3>
                    <div className="flex items-center justify-center space-x-2">
                      <img
                        src={weather.current.condition.icon}
                        alt="weather"
                        className="w-12 h-12"
                      />
                      <span className="text-3xl font-bold">
                        {weather.current.temp_c}°C
                      </span>
                    </div>
                    <p className="text-gray-600">
                      {weather.current.condition.text}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span>Humidity: {weather.current.humidity}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Wind className="h-4 w-4 text-gray-500" />
                      <span>Wind: {weather.current.wind_kph} km/h</span>
                    </div>
                  </div>
                  {weather.forecast && (
                    <div className="space-y-2">
                      <h4 className="font-medium">3-Day Forecast</h4>
                      {weather.forecast.forecastday
                        .slice(0, 3)
                        .map((day, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm">
                              {new Date(day.date).toLocaleDateString("en-US", {
                                weekday: "short",
                              })}
                            </span>
                            <img
                              src={day.day.condition.icon}
                              alt="weather"
                              className="w-6 h-6"
                            />
                            <span className="text-sm">
                              {day.day.maxtemp_c}°/{day.day.mintemp_c}°
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading weather data...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Calendar Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                Farm Calendar
              </CardTitle>
              <CalendarIcon className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              {selectedDate && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800">Selected Date</h4>
                  <p className="text-sm text-green-700">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Chat Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                AI Farm Advisor
              </CardTitle>
              <MessageCircle className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-64 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>Ask me anything about farming!</p>
                    </div>
                  ) : (
                    chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`mb-3 ${msg.role === "user" ? "text-right" : "text-left"}`}
                      >
                        <div
                          className={`inline-block p-2 rounded-lg max-w-xs ${
                            msg.role === "user"
                              ? "bg-green-600 text-white"
                              : "bg-white text-gray-800 border"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                  {loading && (
                    <div className="text-left">
                      <div className="inline-block p-2 rounded-lg bg-white border">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask about farming, crops, weather..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleChatSubmit()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleChatSubmit}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Crop Prices Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Current Crop Prices</span>
                </CardTitle>
                <CardDescription>
                  Search and track current market prices for agricultural
                  commodities
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search crops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCrops.map((crop) => (
                <div
                  key={crop.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{crop.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {crop.category}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-lg font-bold text-green-600">
                        ${crop.pricePerKg}/kg
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Season: {crop.season}
                    </p>
                    <p className="text-sm text-gray-600">
                      Growth: {crop.growthDuration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Sprout className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Crop Planning</h3>
              <p className="text-gray-600">
                Plan your next season's crops based on market trends and weather
                patterns.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Market Analysis</h3>
              <p className="text-gray-600">
                Get insights into price trends and market opportunities for your
                crops.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <CloudSun className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Weather Insights</h3>
              <p className="text-gray-600">
                Receive personalized farming recommendations based on weather
                forecasts.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
