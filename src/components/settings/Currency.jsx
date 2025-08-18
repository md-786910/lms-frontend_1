import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CloudCog, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "../../api/axiosInstance";

function Currency() {
  const { toast } = useToast();

  const [prefixData, setPrefixData] = useState({
    name: "",
    symbol: "",
    id: "",
  });

  const [currencies, setCurrencies] = useState([]);

  const getCurrencies = async () => {
    try {
      const resp = await axiosInstance.get("/setting/currency");
      if (resp.status === 200) {
        const d = resp.data?.data?.map((i) => ({
          id: i.id,
          name: i.name,
          symbol: i.symbol,
        }));
        setCurrencies(d);

        // set default currency
        const defaultCurr = resp.data?.data?.find((t) => t.default);
        setPrefixData({
          id: defaultCurr?.id ?? "1",
          name: defaultCurr?.name ?? "Indian Rupee",
          symbol: defaultCurr?.symbol ?? "₹",
        });
      }
    } catch (error) {
      console.error(
        "Currency options fetch error:",
        error.response?.data || error.message
      );
    }
  };

  const handleSave = async () => {
    try {
      const { id, name, symbol } = prefixData;
      if (!id) {
        alert("id is required");
        return;
      }
      const resp = await axiosInstance.put(`/setting/currency/${id}`, {
        name,
        symbol,
        default_currency: true,
      });
      if (resp.status === 200) {
        getCurrencies();
        toast({
          title: "Currency Saved",
          description: "Currency settings have been updated.",
        });
      }
    } catch (error) {
      console.log("Save error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    getCurrencies();
  }, []);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Currency Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="currency">Default Currency</Label>
            <Select
              disabled
              value={prefixData.name}
              onValueChange={(value) => {
                const selected = currencies.find((c) => c.name === value);
                setPrefixData({
                  name: selected.name,
                  symbol: selected?.symbol || "",
                  id: selected.id,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.name} value={currency.name}>
                    {currency.name} - {currency.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currencySymbol">Currency Symbol</Label>
            <Input
              disabled
              id="currencySymbol"
              value={prefixData.symbol}
              onChange={(e) =>
                setPrefixData({
                  ...prefixData,
                  symbol: e.target.value,
                })
              }
            />
          </div>
        </div>
        <Button
          onClick={() => handleSave()}
          disabled
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Currency Settings
        </Button>
      </CardContent>
    </Card>
  );
}

export default Currency;
