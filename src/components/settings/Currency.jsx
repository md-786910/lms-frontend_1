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
import { CloudCog, Save, IndianRupee } from "lucide-react";
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
    <Card className="border border-[#E1D4C7] bg-[#FAF6F2] shadow-sm rounded-2xl">
      <CardHeader className="border-b border-[#E1D4C7]/60 pb-5">
        <CardTitle className="flex items-center space-x-3 text-xl font-heading font-bold uppercase tracking-tight text-[#24130A]">
          <span className="border border-[#E1D4C7] bg-[#734425]/10 text-[#734425] flex h-11 w-11 items-center justify-center rounded-xl shadow-sm">
            <IndianRupee className="h-5 w-5" />
          </span>
          <div>
            <span>Currency Settings</span>
            <p className="text-xs text-[#2E2E2E]/60 font-sans normal-case tracking-normal mt-0.5 font-normal">
              Select base operating currency and display formatting for all payroll modules
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="currency" className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">Default Currency</Label>
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
              <SelectTrigger className="h-11 border border-[#E1D4C7] bg-[#FAF6F2] rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]">
                <SelectValue placeholder="Select a currency" />
              </SelectTrigger>
              <SelectContent className="border-[#E1D4C7] bg-[#FAF6F2] rounded-xl">
                {currencies.map((currency) => (
                  <SelectItem key={currency.name} value={currency.name}>
                    {currency.name} - {currency.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currencySymbol" className="text-xs font-heading font-bold uppercase tracking-wider text-[#734425]">Currency Symbol</Label>
            <Input
              className="h-11 border border-[#E1D4C7] bg-[#F5ECE4]/70 rounded-xl focus:border-[#734425] transition-all text-[#2E2E2E]"
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
          className="bg-[#734425] hover:bg-[#5D361D] text-white rounded-xl font-heading font-bold uppercase tracking-wider text-xs shadow-md px-6 py-2.5"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Currency Settings
        </Button>
      </CardContent>
    </Card>
  );
}

export default Currency;
