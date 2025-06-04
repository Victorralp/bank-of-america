"use client"

import { useState, useContext } from "react"
import { Download, Calendar, FileText } from "lucide-react"
import { pdfService } from "@/services/pdfService"
import { Transaction } from "@/lib/mockData"
import useBankStore from "@/lib/bankStore"

export function StatementGenerator() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  
  const { accounts, transactions } = useBankStore(state => ({
    accounts: state.accounts,
    transactions: state.transactions
  }))

  const handleGenerateStatement = async () => {
    if (!startDate || !endDate) return

    setIsGenerating(true)

    try {
      // Get the first account for now (in a real app, you'd want to let users select the account)
      const userAccount = accounts[0]
      if (!userAccount) {
        throw new Error("No account found")
      }

      const filteredTransactions = transactions
        .filter((t: Transaction) => 
          t.senderAccount === userAccount.accountNumber || 
          t.receiverAccount === userAccount.accountNumber
        )
        .filter((t: Transaction) => {
          const transactionDate = new Date(t.date)
          const start = new Date(startDate)
          const end = new Date(endDate)
          return transactionDate >= start && transactionDate <= end
        })

      const statement = await pdfService.generateStatement(
        filteredTransactions,
        {
          accountNumber: userAccount.accountNumber,
          accountHolder: "Account Holder", // You'd want to get this from user data
          balance: userAccount.balance,
          startDate: new Date(startDate),
          endDate: new Date(endDate)
        }
      )

      // Create and trigger download
      const url = URL.createObjectURL(statement)
      const a = document.createElement('a')
      a.href = url
      a.download = `statement-${startDate}-to-${endDate}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating statement:", error)
      alert("Error generating statement. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
        <FileText className="w-5 h-5" />
        <span>Generate Statement</span>
      </h3>

      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerateStatement}
          disabled={!startDate || !endDate || isGenerating}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Generate PDF Statement</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
