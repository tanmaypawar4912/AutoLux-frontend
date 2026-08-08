import { useMemo, useState } from "react";
import Reveal from "../components/Reveal";
import type { Car } from "../types";

interface CarEmiCalculatorProps {
  car: Car;
}

const formatINR = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

const CarEmiCalculator = ({ car }: CarEmiCalculatorProps) => {
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(11);
  const [tenureMonths, setTenureMonths] = useState(60);

  const { downPayment, loanAmount, emi, totalInterest, totalPayment, principalShare } =
    useMemo(() => {
      const dp = (car.price * downPaymentPercent) / 100;
      const loan = car.price - dp;
      const monthlyRate = interestRate / 12 / 100;

      const monthlyEmi =
        monthlyRate === 0
          ? loan / tenureMonths
          : (loan * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
            (Math.pow(1 + monthlyRate, tenureMonths) - 1);

      const total = monthlyEmi * tenureMonths;
      const interest = total - loan;
      const share = total > 0 ? Math.round((loan / total) * 100) : 100;

      return {
        downPayment: dp,
        loanAmount: loan,
        emi: monthlyEmi,
        totalInterest: interest,
        totalPayment: total,
        principalShare: share,
      };
    }, [car.price, downPaymentPercent, interestRate, tenureMonths]);

  return (
    <Reveal>
      <div id="emi-calculator" className="scroll-mt-28 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#ff4054]">Plan your budget</p>
        <h2 className="mt-2 text-2xl font-black text-[#111] sm:text-3xl">EMI Calculator</h2>
        <p className="mt-2 text-sm text-gray-500">
          Estimate your monthly installment for the {car.brand} {car.model}. These figures are indicative only.
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          {/* Controls */}
          <div className="space-y-7">
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="downPayment" className="text-sm font-semibold text-[#111]">
                  Down Payment
                </label>
                <span className="text-sm font-bold text-[#ff4054]">
                  {formatINR(downPayment)} ({downPaymentPercent}%)
                </span>
              </div>
              <input
                id="downPayment"
                type="range"
                min={0}
                max={50}
                step={5}
                value={downPaymentPercent}
                onChange={(event) => setDownPaymentPercent(Number(event.target.value))}
                className="mt-3 w-full accent-[#ff4054]"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>0%</span>
                <span>50%</span>
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="interestRate" className="text-sm font-semibold text-[#111]">
                  Interest Rate (p.a.)
                </label>
                <span className="text-sm font-bold text-[#ff4054]">{interestRate}%</span>
              </div>
              <input
                id="interestRate"
                type="range"
                min={7}
                max={16}
                step={0.5}
                value={interestRate}
                onChange={(event) => setInterestRate(Number(event.target.value))}
                className="mt-3 w-full accent-[#ff4054]"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>7%</span>
                <span>16%</span>
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="tenure" className="text-sm font-semibold text-[#111]">
                  Loan Tenure
                </label>
                <span className="text-sm font-bold text-[#ff4054]">
                  {tenureMonths} months ({(tenureMonths / 12).toFixed(1)} yrs)
                </span>
              </div>
              <input
                id="tenure"
                type="range"
                min={12}
                max={84}
                step={12}
                value={tenureMonths}
                onChange={(event) => setTenureMonths(Number(event.target.value))}
                className="mt-3 w-full accent-[#ff4054]"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>1 yr</span>
                <span>7 yrs</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="rounded-3xl bg-[#f8f8f8] p-6">
            <p className="text-sm text-gray-500">Estimated Monthly EMI</p>
            <p className="mt-1 text-4xl font-black text-[#111]">{formatINR(emi)}</p>

            <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-[#ff4054] transition-all"
                style={{ width: `${principalShare}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs font-semibold text-gray-500">
              <span>Principal {principalShare}%</span>
              <span>Interest {100 - principalShare}%</span>
            </div>

            <div className="mt-6 space-y-3 border-t border-gray-200 pt-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Loan Amount</span>
                <span className="font-bold text-[#111]">{formatINR(loanAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Interest</span>
                <span className="font-bold text-[#111]">{formatINR(totalInterest)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Payment</span>
                <span className="font-bold text-[#111]">{formatINR(totalPayment)}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          *Indicative estimate only. Actual EMI depends on the lender, credit profile, and processing charges.
        </p>
      </div>
    </Reveal>
  );
};

export default CarEmiCalculator;
