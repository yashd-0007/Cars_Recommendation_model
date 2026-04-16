import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";
import EmiChart from "./EmiChart";

const EmiCalculator = () => {
  // States for Inputs
  const [loanAmount, setLoanAmount] = useState(1000000); // 10 Lakh default
  const [interestRate, setInterestRate] = useState(9.5); // 9.5% default
  const [durationYears, setDurationYears] = useState(5); // 5 years default

  // States for Results
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);

  // Formatting utility
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Live EMI Calculation Math
  useEffect(() => {
    const P = loanAmount;
    const R = interestRate / 12 / 100; // Monthly interest rate
    const N = durationYears * 12; // Loan tenure in months

    if (P > 0 && R > 0 && N > 0) {
      // EMI = [P × R × (1+R)^N] / [(1+R)^N − 1]
      const mathEmi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
      const mathTotalPayable = mathEmi * N;
      const mathTotalInterest = mathTotalPayable - P;

      setEmi(mathEmi);
      setTotalPayable(mathTotalPayable);
      setTotalInterest(mathTotalInterest);
    } else {
      setEmi(0);
      setTotalPayable(P);
      setTotalInterest(0);
    }
  }, [loanAmount, interestRate, durationYears]);

  return (
    <section className="py-16 px-4 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm mb-4">
            <Calculator className="w-4 h-4 text-primary" />
            Finance Planning
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-sans mb-4">
            EMI <span className="text-gradient-golden">Calculator</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Estimate your monthly car loan payments. Adjust the principal amount, interest rate, and duration to find a plan that fits your exact budget.
          </p>
        </div>

        <div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-xl"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {/* Left Side: Sliders and Inputs */}
          <div className="lg:col-span-7 space-y-8 lg:pr-8 lg:border-r border-border">
            
            {/* Loan Amount */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-md font-semibold font-sans">Loan Amount</Label>
                <div className="w-1/3">
                  <Input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="text-right font-medium"
                    min={0}
                  />
                </div>
              </div>
              <Slider
                value={[loanAmount]}
                onValueChange={(val) => setLoanAmount(val[0])}
                max={5000000} // 50 Lakhs Max
                step={50000}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₹0</span>
                <span>₹50L</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-md font-semibold font-sans">Interest Rate (p.a.)</Label>
                <div className="w-1/3 relative">
                  <Input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="text-right font-medium pr-8"
                    min={1}
                    max={20}
                    step={0.1}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">%</span>
                </div>
              </div>
              <Slider
                value={[interestRate]}
                onValueChange={(val) => setInterestRate(val[0])}
                max={15}
                min={1}
                step={0.1}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1%</span>
                <span>15%</span>
              </div>
            </div>

            {/* Loan Duration */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-md font-semibold font-sans">Loan Tenure</Label>
                <div className="w-1/3 relative">
                  <Input
                    type="number"
                    value={durationYears}
                    onChange={(e) => setDurationYears(Number(e.target.value))}
                    className="text-right font-medium pr-14"
                    min={1}
                    max={30}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">Years</span>
                </div>
              </div>
              <Slider
                value={[durationYears]}
                onValueChange={(val) => setDurationYears(val[0])}
                max={10}
                min={1}
                step={1}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 Year</span>
                <span>10 Years</span>
              </div>
            </div>
          </div>

          {/* Right Side: Results and Chart */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="text-center p-6 bg-accent/50 rounded-xl border border-border">
              <p className="text-muted-foreground text-sm font-medium mb-1">Monthly EMI</p>
              <h3 className="text-4xl font-bold text-gradient-golden">{formatCurrency(emi)}</h3>
            </div>

            <EmiChart principal={loanAmount} interest={totalInterest} />

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-border" style={{ backgroundColor: "hsl(40, 15%, 89%)" }}></div>
                  <span className="text-muted-foreground">Principal Amount</span>
                </div>
                <span className="font-semibold">{formatCurrency(loanAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" style={{ backgroundColor: "hsl(36, 90%, 50%)" }}></div>
                  <span className="text-muted-foreground">Total Interest</span>
                </div>
                <span className="font-semibold">{formatCurrency(totalInterest)}</span>
              </div>
              <div className="flex justify-between items-center text-base pt-2 font-bold border-t border-border/50">
                <span>Total Payable</span>
                <span>{formatCurrency(totalPayable)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EmiCalculator;
