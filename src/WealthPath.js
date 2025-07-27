```jsx
import React, { useState, useEffect, useCallback } from 'react';

const WealthPath = () => {
  const [bills, setBills] = useState([
    {
      id: 1,
      name: "Credit Card",
      phone: "1-800-555-0123",
      amount: 5000,
      totalBalance: 5000,
      minimumPayment: 150,
      interestRate: 18.99,
      dueDate: "2025-08-15",
      accountNumber: "****1234"
    },
    {
      id: 2,
      name: "Student Loan",
      phone: "1-800-555-0456",
      amount: 25000,
      totalBalance: 25000,
      minimumPayment: 300,
      interestRate: 6.5,
      dueDate: "2025-08-01",
      accountNumber: "****5678"
    }
  ]);
  
  const [income, setIncome] = useState([
    {
      id: 1,
      source: "Software Engineer Salary",
      amount: 8500,
      frequency: "monthly",
      nextPayment: "2025-08-01"
    },
    {
      id: 2,
      source: "Freelance Projects",
      amount: 1200,
      frequency: "monthly",
      nextPayment: "2025-08-15"
    }
  ]);
  
  const [investments, setInvestments] = useState([
    {
      id: 1,
      name: "S&P 500 Index Fund",
      type: "index-funds",
      amount: 15000,
      expectedReturn: 10,
      riskLevel: "medium"
    },
    {
      id: 2,
      name: "Real Estate Investment",
      type: "real-estate",
      amount: 50000,
      expectedReturn: 8,
      riskLevel: "medium"
    }
  ]);
  
  const [view, setView] = useState('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [wealthGoal] = useState(20000000);
  const [currentNetWorth, setCurrentNetWorth] = useState(0);
  const [gamificationScore, setGamificationScore] = useState(350);
  const [dailyQuote] = useState({
    text: "Byron, the stock market is a device for transferring money from the impatient to the patient.",
    author: "Warren Buffett"
  });
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [achievements] = useState([
    {
      id: 1,
      title: "First Investment",
      description: "Added your first investment to the portfolio",
      icon: "🎯",
      points: 50
    },
    {
      id: 2,
      title: "Debt Tracker",
      description: "Started tracking your debts",
      icon: "📊",
      points: 25
    }
  ]);

  // State for business opportunities and app improvements (now dynamic)
  const [opportunities, setOpportunities] = useState([]);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(true);
  const [errorOpportunities, setErrorOpportunities] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    amount: '',
    accountNumber: '',
    dueDate: '',
    lateFee: '',
    minimumPayment: '',
    interestRate: '',
    totalBalance: ''
  });

  const [incomeData, setIncomeData] = useState({
    source: '',
    amount: '',
    frequency: 'monthly',
    nextPayment: ''
  });

  const [investmentData, setInvestmentData] = useState({
    name: '',
    type: 'stocks',
    amount: '',
    expectedReturn: '',
    riskLevel: 'medium'
  });

  // Login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Fetch opportunities from NewsAPI daily
  useEffect(() => {
    const fetchOpportunities = async () => {
      setIsLoadingOpportunities(true);
      setErrorOpportunities(null);
      try {
        // Combine searches for business opportunities, fintech trends, and app improvements
        const query = 'business+opportunities+OR+fintech+trends+OR+mobile+app+development+improvements';
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=relevancy&apiKey=19e33b5882814c0eadd599b139c9e92a`
        );
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        
        // Categorize articles (simplified logic based on keywords)
        const categorized = data.articles.slice(0, 6).map((article, index) => {
          const titleLower = article.title.toLowerCase();
          const isAppImprovement = titleLower.includes('app') || titleLower.includes('mobile') || titleLower.includes('software');
          return {
            id: article.url + index, // Ensure unique ID
            type: isAppImprovement ? 'app-improvement' : 'business-opportunity',
            title: article.title || 'Untitled',
            description: article.description || 'No description available.',
            source: article.source.name || 'Unknown Source',
            link: article.url || '#'
          };
        });
        
        setOpportunities(categorized);
      } catch (err) {
        setErrorOpportunities(err.message);
        // Fallback to static data if API fails
        setOpportunities([
          {
            id: 1,
            type: "business-opportunity",
            title: "AI-Powered Financial Tools",
            description: "Invest in AI-driven personal finance apps. AI adoption in fintech grows at 25% CAGR.",
            source: "Fallback Data",
            link: "#"
          },
          {
            id: 2,
            type: "app-improvement",
            title: "API Integrations",
            description: "Integrate with bank APIs (e.g., Plaid) for real-time account syncing.",
            source: "Fallback Data",
            link: "#"
          }
        ]);
      } finally {
        setIsLoadingOpportunities(false);
      }
    };

    fetchOpportunities();
    // Run daily (every 24 hours)
    const interval = setInterval(fetchOpportunities, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Story progression based on net worth
  const getStoryChapter = (netWorth) => {
    if (netWorth < 0) return {
      chapter: "Chapter 1: The Awakening",
      title: "Byron's Journey Begins",
      description: "Every hero's journey starts with a challenge. Your story is just beginning.",
      stage: "origin",
      nextMilestone: 0
    };
    if (netWorth >= 0 && netWorth < 10000) return {
      chapter: "Chapter 2: Breaking Free",
      title: "Escaping the Debt Prison",
      description: "Byron breaks the chains of debt and sees the light of financial freedom.",
      stage: "breakthrough",
      nextMilestone: 10000
    };
    if (netWorth >= 10000 && netWorth < 50000) return {
      chapter: "Chapter 3: The Foundation",
      title: "Building the Empire's Base",
      description: "With debt behind him, Byron begins laying the cornerstone of his financial empire.",
      stage: "building",
      nextMilestone: 50000
    };
    if (netWorth >= 50000 && netWorth < 100000) return {
      chapter: "Chapter 4: The Momentum",
      title: "The Snowball Effect",
      description: "Byron's wealth begins to accelerate. The compound effect takes hold.",
      stage: "acceleration",
      nextMilestone: 100000
    };
    if (netWorth >= 100000 && netWorth < 500000) return {
      chapter: "Chapter 5: The Transformation",
      title: "From Worker to Investor",
      description: "Byron's mindset shifts from earning money to making money work for him.",
      stage: "transformation",
      nextMilestone: 500000
    };
    if (netWorth >= 500000 && netWorth < 1000000) return {
      chapter: "Chapter 6: The Ascension",
      title: "Approaching Millionaire Status",
      description: "Byron can see the million-dollar milestone on the horizon. The dream becomes reality.",
      stage: "ascension",
      nextMilestone: 1000000
    };
    return {
      chapter: "Chapter 7: The Millionaire Mindset",
      title: "Joining the Elite",
      description: "Byron has crossed into millionaire territory. The game has changed forever.",
      stage: "elite",
      nextMilestone: 5000000
    };
  };

  const [currentChapter, setCurrentChapter] = useState(getStoryChapter(35000));

  // Story-driven motivational messages
  const getStoryMotivation = (chapter) => {
    const motivations = {
      "Chapter 1: The Awakening": [
        "Byron, every billionaire started exactly where you are now. Your story is being written.",
        "Byron, this is your origin story. Every hero faces their darkest hour before their triumph.",
        "Byron, the fact that you're here means you're already different from 95% of people."
      ],
      "Chapter 2: Breaking Free": [
        "Byron, you're breaking the chains that held you back. Your transformation has begun.",
        "Byron, each debt you eliminate is a chapter of freedom you're writing.",
        "Byron, you're not just paying bills - you're rewriting your entire life story."
      ],
      "Chapter 3: The Foundation": [
        "Byron, every skyscraper needs a solid foundation. You're building yours.",
        "Byron, this is where your wealth empire begins. Every dollar invested is a brick in your castle.",
        "Byron, you've moved from surviving to thriving. The foundation is set."
      ],
      "Chapter 4: The Momentum": [
        "Byron, feel the momentum building. Your money is starting to work as hard as you do.",
        "Byron, this is the chapter where compound interest becomes your superpower.",
        "Byron, you're in the acceleration phase. The snowball is rolling downhill."
      ]
    };
    
    const messages = motivations[chapter] || motivations["Chapter 1: The Awakening"];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Define getProgressToGoal before useEffects
  const getProgressToGoal = useCallback(() => {
    return Math.max(0, Math.min(100, (currentNetWorth / wealthGoal) * 100));
  }, [currentNetWorth, wealthGoal]);

  // Calculate net worth and recommendations
  useEffect(() => {
    const totalDebt = bills.reduce((sum, bill) => sum + (bill.totalBalance || 0), 0);
    const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0);
    
    const netWorth = totalInvestments - totalDebt;
    setCurrentNetWorth(netWorth);
    setCurrentChapter(getStoryChapter(netWorth));
  }, [bills, income, investments]);

  // Generate in-app notifications with fixed date logic
  useEffect(() => {
    if (isLoggedIn) {
      const newNotifications = [];
      
      bills.forEach(bill => {
        const dueDate = new Date(bill.dueDate + 'T00:00:00Z');
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        
        console.log(`Bill: ${bill.name}, Due: ${bill.dueDate}, Days Until: ${daysUntil}`);
        
        if (daysUntil <= 0) {
          newNotifications.push({ id: bill.id, message: `${bill.name} is overdue!` });
        } else if (daysUntil <= 3) {
          newNotifications.push({ id: bill.id, message: `${bill.name} due in ${daysUntil} days.` });
        }
      });
      
      const progress = getProgressToGoal();
      if (progress < 1) {
        newNotifications.push({ id: 'networth', message: 'Your net worth progress is low - consider adding investments!' });
      }
      
      setNotifications(newNotifications);
    }
  }, [isLoggedIn, bills, currentNetWorth, getProgressToGoal]);

  // Debt avalanche/snowball recommendation
  const getDebtStrategy = () => {
    const sortedByInterest = [...bills].sort((a, b) => (b.interestRate || 0) - (a.interestRate || 0));
    const sortedByBalance = [...bills].sort((a, b) => (a.totalBalance || 0) - (b.totalBalance || 0));
    
    return {
      avalanche: sortedByInterest,
      snowball: sortedByBalance
    };
  };

  // Investment recommendations
  const getInvestmentRecommendations = () => {
    const monthlyIncome = income.reduce((sum, inc) => {
      if (inc.frequency === 'one-time') return sum;
      const multiplier = inc.frequency === 'weekly' ? 52/12 : inc.frequency === 'monthly' ? 1 : 1/12;
      return sum + (inc.amount * multiplier);
    }, 0);
    
    const monthlyDebtPayments = bills.reduce((sum, bill) => sum + (bill.minimumPayment || 0), 0);
    const availableForInvestment = monthlyIncome - monthlyDebtPayments - (monthlyIncome * 0.5);
    
    const yearsToGoal = 25;
    const requiredMonthlyInvestment = wealthGoal / (yearsToGoal * 12);
    
    return {
      available: Math.max(0, availableForInvestment),
      required: requiredMonthlyInvestment,
      recommendation: availableForInvestment >= requiredMonthlyInvestment ? 
        'You can reach your $20M goal!' : 
        'Increase income or reduce expenses to reach your goal faster.'
    };
  };

  // Advanced smart financial advice using billionaire strategies
  const getSmartAdvice = () => {
    const advice = [];
    const totalDebt = bills.reduce((sum, bill) => sum + (bill.totalBalance || 0), 0);
    const highInterestDebt = bills.filter(bill => (bill.interestRate || 0) > 15);
    const monthlyIncome = income.reduce((sum, inc) => {
      if (inc.frequency === 'one-time') return sum;
      const multiplier = inc.frequency === 'weekly' ? 52/12 : inc.frequency === 'monthly' ? 1 : 1/12;
      return sum + (inc.amount * multiplier);
    }, 0);
    const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const emergencyFund = totalInvestments * 0.1;
    const requiredEmergencyFund = monthlyIncome * 6;
    
    if (emergencyFund < requiredEmergencyFund) {
      advice.push({
        category: 'Emergency Fund',
        text: `Byron, build a ${formatCurrency(requiredEmergencyFund)} emergency fund (6 months expenses) before aggressive investing. Buffett says "Cash combined with courage in a crisis is priceless."`,
        priority: 'high',
        icon: '🛡️'
      });
    }
    
    if (highInterestDebt.length > 0) {
      advice.push({
        category: 'Debt Strategy',
        text: `Byron, eliminate ${highInterestDebt.length} high-interest debts first. Total debt: ${formatCurrency(totalDebt)}. Guaranteed ${Math.max(...highInterestDebt.map(d => d.interestRate))}% return beats risky investments.`,
        priority: 'critical',
        icon: '⚡'
      });
    }
    
    if (totalInvestments > 0) {
      advice.push({
        category: 'Tax Strategy',
        text: `Byron, maximize 401k/IRA contributions ($23,000 + $7,000). Bezos built wealth through tax-deferred growth and strategic timing.`,
        priority: 'medium',
        icon: '💰'
      });
    }
    
    const stocksPercentage = investments.filter(inv => inv.type === 'stocks').reduce((sum, inv) => sum + inv.amount, 0) / (totalInvestments || 1) * 100;
    if (stocksPercentage > 60 || totalInvestments === 0) {
      advice.push({
        category: 'Diversification',
        text: `Byron, follow Ray Dalio's All Weather: 30% stocks, 40% long-term bonds, 15% intermediate bonds, 7.5% commodities, 7.5% REITS.`,
        priority: 'medium',
        icon: '📊'
      });
    }
    
    const indexFunds = investments.filter(inv => inv.type === 'index-funds').length;
    if (indexFunds === 0) {
      advice.push({
        category: 'Core Holdings',
        text: `Byron, Buffett recommends 90% S&P 500 index funds for most investors. Low fees (0.03%) compound to massive savings over time.`,
        priority: 'high',
        icon: '📈'
      });
    }
    
    return advice.sort((a, b) => {
      const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.amount || !formData.dueDate) {
      alert('Please fill in required fields');
      return;
    }

    const billData = {
      ...formData,
      id: editingBill ? editingBill.id : Date.now(),
      amount: parseFloat(formData.amount),
      lateFee: parseFloat(formData.lateFee) || 0,
      minimumPayment: parseFloat(formData.minimumPayment) || 0,
      interestRate: parseFloat(formData.interestRate) || 0,
      totalBalance: parseFloat(formData.totalBalance) || parseFloat(formData.amount)
    };

    if (editingBill) {
      setBills(bills.map(bill => bill.id === editingBill.id ? billData : bill));
      setEditingBill(null);
    } else {
      setBills([...bills, billData]);
      setGamificationScore(prev => prev + 10);
    }

    setFormData({
      name: '', phone: '', amount: '', accountNumber: '', dueDate: '',
      lateFee: '', minimumPayment: '', interestRate: '', totalBalance: ''
    });
    setShowAddForm(false);
  };

  const handleIncomeSubmit = () => {
    if (!incomeData.source || !incomeData.amount) {
      alert('Please fill in required fields');
      return;
    }

    const newIncome = {
      ...incomeData,
      id: Date.now(),
      amount: parseFloat(incomeData.amount)
    };

    setIncome([...income, newIncome]);
    setGamificationScore(prev => prev + 20);
    setIncomeData({ source: '', amount: '', frequency: 'monthly', nextPayment: '' });
    setShowIncomeForm(false);
  };

  const handleInvestmentSubmit = () => {
    if (!investmentData.name || !investmentData.amount) {
      alert('Please fill in required fields');
      return;
    }

    const newInvestment = {
      ...investmentData,
      id: Date.now(),
      amount: parseFloat(investmentData.amount),
      expectedReturn: parseFloat(investmentData.expectedReturn) || 7
    };

    setInvestments([...investments, newInvestment]);
    setGamificationScore(prev => prev + 50);
    setInvestmentData({ name: '', type: 'stocks', amount: '', expectedReturn: '', riskLevel: 'medium' });
    setShowInvestmentForm(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginUsername === 'bperkins7468' && loginPassword === 'NN0456!9430$') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const clearNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const DashboardView = () => {
    const debtStrategy = getDebtStrategy();
    const investmentRec = getInvestmentRecommendations();
    const smartAdvice = getSmartAdvice();
    const progressPercent = getProgressToGoal();

    return (
      <div className="space-y-6">
        {/* Byron's Story Chapter */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <span>📖</span>
              <span className="font-semibold">Your Wealth Story</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">{currentChapter.chapter}</h2>
            <h3 className="text-lg font-semibold mb-3 opacity-90">{currentChapter.title}</h3>
            <p className="text-sm opacity-80 mb-4">{currentChapter.description}</p>
            
            {currentChapter.nextMilestone && (
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Next Chapter Unlocks At:</span>
                  <span>{formatCurrency(currentChapter.nextMilestone)}</span>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                  <div 
                    className="bg-yellow-300 h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${Math.min(100, (currentNetWorth / currentChapter.nextMilestone) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Story Motivation */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <span>❤️</span>
            <span className="font-semibold">Today's Story Motivation</span>
          </div>
          <p className="text-lg italic">"{getStoryMotivation(currentChapter.chapter)}"</p>
        </div>

        {/* Daily Quote */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <span>🧠</span>
            <span className="font-semibold">Daily Wisdom</span>
          </div>
          <p className="text-lg italic">"{dailyQuote.text}"</p>
          <p className="text-sm opacity-90 mt-2">- {dailyQuote.author}</p>
        </div>

        {/* Opportunities & Improvements Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span>🚀</span>
            <h3 className="text-xl font-bold text-gray-800">Opportunities & App Improvements</h3>
          </div>
          {isLoadingOpportunities ? (
            <div className="text-center py-4 text-gray-500">
              <span>🔄</span>
              <p>Loading latest opportunities...</p>
            </div>
          ) : errorOpportunities ? (
            <div className="text-center py-4 text-red-500">
              <span>⚠️</span>
              <p>Error: {errorOpportunities}. Showing fallback data.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {opportunities.map((item) => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{item.type === 'business-opportunity' ? '💡' : '🔧'}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-700">{item.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Source: {item.source}</p>
                      {item.link !== "#" && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline">
                          Learn More
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center py-2">
                <button className="text-blue-500 text-sm font-medium">
                  Refresh for Latest Opportunities
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wealth Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">The $20M Quest</h3>
              <div className="flex items-center gap-2">
                <span>🏆</span>
                <span>👁️</span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span className="font-medium">Byron's Net Worth Journey</span>
                <span className="font-bold">{formatCurrency(wealthGoal)} Destiny</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-4 rounded-full transition-all duration-1000 relative"
                  style={{ width: `${Math.max(1, progressPercent)}%` }}
                >
                  <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <span className="text-3xl font-bold text-green-600 block">
                  {formatCurrency(currentNetWorth)}
                </span>
                <span className="text-sm text-gray-500">Current Net Worth</span>
              </div>
              <div className="text-center">
                <span className="text-lg font-bold text-blue-600 block">
                  {progressPercent.toFixed(3)}%
                </span>
                <span className="text-sm text-gray-500">Quest Complete</span>
              </div>
            </div>
            
            <div className="mt-4 bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Remaining to Victory:</span>
                <span className="font-bold text-red-600">
                  {formatCurrency(Math.max(0, wealthGoal - currentNetWorth))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        {achievements.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <span>🏅</span>
              <h3 className="text-xl font-bold">Latest Achievements</h3>
            </div>
            <div className="space-y-3">
              {achievements.slice(-2).map((achievement) => (
                <div key={achievement.id} className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <h4 className="font-bold">{achievement.title}</h4>
                      <p className="text-sm opacity-90">{achievement.description}</p>
                      <span className="text-xs font-bold">+{achievement.points} points</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Gamification Score */}
        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Wealth Builder Score</h3>
              <p className="text-4xl font-bold">{gamificationScore.toFixed(0)}</p>
              <p className="text-sm opacity-90">Level {Math.floor(gamificationScore / 100) + 1} Investor</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src="/wealthlogo.png" alt="Wealth Logo" className="h-8 w-8" />
              <span>🏅</span>
              <div className="text-center">
                <p className="text-xs font-bold">{achievements.length}</p>
                <p className="text-xs">Achievements</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress to Level {Math.floor(gamificationScore / 100) + 2}</span>
              <span>{((gamificationScore % 100)).toFixed(0)}/100</span>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${(gamificationScore % 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Smart Advice */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span>⚡</span>
            <h3 className="text-xl font-bold text-gray-800">Billionaire Strategies</h3>
          </div>
          <div className="space-y-4">
            {smartAdvice.slice(0, 5).map((advice, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                advice.priority === 'critical' ? 'bg-red-50 border-red-500' :
                advice.priority === 'high' ? 'bg-orange-50 border-orange-500' :
                advice.priority === 'medium' ? 'bg-blue-50 border-blue-500' :
                'bg-green-50 border-green-500'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{advice.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{advice.category}</h4>
                    <p className="text-sm text-gray-700">{advice.text}</p>
                  </div>
                </div>
              </div>
            ))}
            {smartAdvice.length > 5 && (
              <div className="text-center py-2">
                <button className="text-blue-500 text-sm font-medium">
                  View {smartAdvice.length - 5} More Strategies →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Investment Recommendations */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span>📈</span>
            <h3 className="text-xl font-bold text-gray-800">Investment Strategy</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Monthly Available</p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(investmentRec.available)}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Required for Goal</p>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(investmentRec.required)}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700">{investmentRec.recommendation}</p>
          </div>
        </div>

        {/* Debt Strategy */}
        {bills.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <span>🎯</span>
              <h3 className="text-xl font-bold text-gray-800">Debt Elimination Strategy</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-700 mb-2">Priority Order (Debt Avalanche)</h4>
                {debtStrategy.avalanche.slice(0, 3).map((bill, index) => (
                  <div key={bill.id} className="flex justify-between items-center text-sm">
                    <span>{index + 1}. {bill.name}</span>
                    <span className="font-medium">{bill.interestRate || 0}% APR</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const BillsView = () => (
    <div className="space-y-4">
      {bills.map(bill => {
        const dueDate = new Date(bill.dueDate + 'T00:00:00Z');
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        
        return (
          <div key={bill.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{bill.name}</h3>
                <p className="text-sm text-gray-600">{bill.phone}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingBill(bill);
                    setFormData({
                      ...bill,
                      amount: bill.amount.toString(),
                      lateFee: bill.lateFee?.toString() || '',
                      minimumPayment: bill.minimumPayment?.toString() || '',
                      interestRate: bill.interestRate?.toString() || '',
                      totalBalance: bill.totalBalance?.toString() || ''
                    });
                    setShowAddForm(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  ✏️
                </button>
                <button
                  onClick={() => setBills(bills.filter(b => b.id !== bill.id))}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Balance:</span>
                <span className="font-bold ml-2">{formatCurrency(bill.totalBalance || bill.amount)}</span>
              </div>
              <div>
                <span className="text-gray-600">Min Payment:</span>
                <span className="font-bold ml-2">{formatCurrency(bill.minimumPayment || 0)}</span>
              </div>
              <div>
                <span className="text-gray-600">Interest Rate:</span>
                <span className="font-bold ml-2">{bill.interestRate || 0}%</span>
              </div>
              <div>
                <span className="text-gray-600">Due Date:</span>
                <span className="font-bold ml-2">{new Date(bill.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className={`mt-4 p-3 rounded-lg text-center font-medium ${
              daysUntil <= 0 ? 'bg-red-100 text-red-700' :
              daysUntil <= 3 ? 'bg-orange-100 text-orange-700' :
              daysUntil <= 7 ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {daysUntil <= 0 ? 'OVERDUE' : `${daysUntil} days until due`}
            </div>
          </div>
        );
      })}
      
      {bills.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <span>💳</span>
          <p>No bills added yet. Start building your wealth by tracking your debts!</p>
        </div>
      )}
    </div>
  );

  const WealthView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>📊</span>
          Investment Portfolio
        </h3>
        {investments.length === 0 ? (
          <div className="text-center py-8">
            <span>📈</span>
            <p className="text-gray-500">No investments yet. Start building your portfolio!</p>
            <button 
              onClick={() => setShowInvestmentForm(true)}
              className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Add First Investment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg text-center overflow-hidden">
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-xl font-bold text-green-600 truncate">
                  {formatCurrency(investments.reduce((sum, inv) => sum + inv.amount, 0))}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center overflow-hidden">
                <p className="text-sm text-gray-600">Avg Return</p>
                <p className="text-xl font-bold text-blue-600 truncate">
                  {investments.length > 0 ? 
                    (investments.reduce((sum, inv) => sum + (inv.expectedReturn || 7), 0) / investments.length).toFixed(1) : 0}%
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center overflow-hidden">
                <p className="text-sm text-gray-600">Holdings</p>
                <p className="text-xl font-bold text-purple-600 truncate">{investments.length}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {investments.map(inv => (
                <div key={inv.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-semibold">{inv.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{inv.type.replace('-', ' ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(inv.amount)}</p>
                      <p className="text-sm text-green-600">{inv.expectedReturn || 7}% expected</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="capitalize">{inv.riskLevel} Risk</span>
                    <span>Annual Projection: {formatCurrency(inv.amount * (inv.expectedReturn || 7) / 100)}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mt-6">
              <h4 className="font-semibold text-blue-800 mb-2">Portfolio Analysis</h4>
              <div className="space-y-2 text-sm text-blue-700">
                {(() => {
                  const totalValue = investments.reduce((sum, inv) => sum + inv.amount, 0);
                  const stocksPercent = investments.filter(inv => inv.type === 'stocks').reduce((sum, inv) => sum + inv.amount, 0) / (totalValue || 1) * 100;
                  const bondsPercent = investments.filter(inv => inv.type === 'bonds').reduce((sum, inv) => sum + inv.amount, 0) / (totalValue || 1) * 100;
                  const realEstatePercent = investments.filter(inv => inv.type === 'real-estate').reduce((sum, inv) => sum + inv.amount, 0) / (totalValue || 1) * 100;
                  
                  const recommendations = [];
                  if (stocksPercent > 70) recommendations.push("Consider reducing stock allocation below 70% for better diversification");
                  if (bondsPercent < 20 && totalValue > 50000) recommendations.push("Add bonds for stability (target 20-30%)");
                  if (realEstatePercent < 10 && totalValue > 100000) recommendations.push("Consider real estate investments for inflation protection");
                  if (recommendations.length === 0) recommendations.push("Portfolio allocation looks well-balanced!");
                  
                  return recommendations.map((rec, index) => (
                    <p key={index}>• {rec}</p>
                  ));
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>💼</span>
          Income Sources
        </h3>
        {income.length === 0 ? (
          <div className="text-center py-8">
            <span>$</span>
            <p className="text-gray-500">No income sources tracked yet.</p>
            <button 
              onClick={() => setShowIncomeForm(true)}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Income Source
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Monthly Income</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(income.reduce((sum, inc) => {
                    if (inc.frequency === 'one-time') return sum;
                    const multiplier = inc.frequency === 'weekly' ? 52/12 : inc.frequency === 'monthly' ? 1 : 1/12;
                    return sum + (inc.amount * multiplier);
                  }, 0))}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Annual Income</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(income.reduce((sum, inc) => {
                    if (inc.frequency === 'one-time') return sum + inc.amount;
                    const multiplier = inc.frequency === 'weekly' ? 52 : inc.frequency === 'monthly' ? 12 : 1;
                    return sum + (inc.amount * multiplier);
                  }, 0))}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              {income.map(inc => (
                <div key={inc.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{inc.source}</h4>
                      <p className="text-sm text-gray-600 capitalize">{inc.frequency}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(inc.amount)}</p>
                      {inc.frequency !== 'one-time' && (
                        <p className="text-sm text-gray-600">
                          {formatCurrency(inc.amount * (inc.frequency === 'weekly' ? 52 : inc.frequency === 'monthly' ? 12 : 1))} annually
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
          <h1 className="text-2xl font-bold text-center mb-6">Login to WealthPath</h1>
          <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
            <input
              type="text"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                WealthPath
              </h1>
              <p className="text-xs text-gray-600">Your $20M Journey, Byron</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                <img src="/wealthlogo.png" alt="Wealth Logo" className="h-4 w-4" />
                <span className="text-xs font-bold text-yellow-700">{gamificationScore.toFixed(0)}</span>
              </div>
              <div className="relative">
                <span>🔔</span>
                {notifications.length > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="bg-yellow-100 p-4 rounded-xl shadow-lg space-y-2">
            <h3 className="font-bold text-yellow-800">Notifications</h3>
            {notifications.map(notif => (
              <div key={notif.id} className="flex justify-between items-center text-sm text-yellow-700">
                <span>{notif.message}</span>
                <button onClick={() => clearNotification(notif.id)} className="text-yellow-500">
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex bg-white rounded-xl shadow-lg p-2">
          <button
            onClick={() => setView('dashboard')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-lg transition-all ${
              view === 'dashboard' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span>📊</span>
            Dashboard
          </button>
          <button
            onClick={() => setView('bills')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-lg transition-all ${
              view === 'bills' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span>💳</span>
            Bills
          </button>
          <button
            onClick={() => setView('wealth')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-lg transition-all ${
              view === 'wealth' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span>📈</span>
            Wealth
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pb-20">
        {view === 'dashboard' && <DashboardView />}
        {view === 'bills' && <BillsView />}
        {view === 'wealth' && <WealthView />}
      </div>

      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button
          onClick={() => setShowInvestmentForm(true)}
          className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        >
          <span>📈</span>
        </button>
        <button
          onClick={() => setShowIncomeForm(true)}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <span>💼</span>
        </button>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 transition-colors"
        >
          <span>+</span>
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingBill ? 'Edit Bill' : 'Add New Bill'}
              </h2>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Bill Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  
                  <input
                    type="number"
                    placeholder="Total Balance"
                    value={formData.totalBalance}
                    onChange={(e) => setFormData({...formData, totalBalance: e.target.value})}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Min Payment"
                    value={formData.minimumPayment}
                    onChange={(e) => setFormData({...formData, minimumPayment: e.target.value})}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  
                  <input
                    type="number"
                    placeholder="Interest Rate %"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({...formData, interestRate: e.target.value})}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <input
                  type="text"
                  placeholder="Account Number"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                
                <input
                  type="number"
                  placeholder="Late Fee"
                  value={formData.lateFee}
                  onChange={(e) => setFormData({...formData, lateFee: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingBill(null);
                      setFormData({
                        name: '', phone: '', amount: '', accountNumber: '', dueDate: '',
                        lateFee: '', minimumPayment: '', interestRate: '', totalBalance: ''
                      });
                    }}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
                  >
                    {editingBill ? 'Update' : 'Add'} Bill
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showIncomeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Income Source</h2>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Income Source (e.g., Salary, Freelance)"
                  value={incomeData.source}
                  onChange={(e) => setIncomeData({...incomeData, source: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <input
                  type="number"
                  placeholder="Amount"
                  value={incomeData.amount}
                  onChange={(e) => setIncomeData({...incomeData, amount: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <select
                  value={incomeData.frequency}
                  onChange={(e) => setIncomeData({...incomeData, frequency: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="one-time">One-time</option>
                </select>
                
                <input
                  type="date"
                  placeholder="Next Payment Date"
                  value={incomeData.nextPayment}
                  onChange={(e) => setIncomeData({...incomeData, nextPayment: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowIncomeForm(false);
                      setIncomeData({ source: '', amount: '', frequency: 'monthly', nextPayment: '' });
                    }}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleIncomeSubmit}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-green-600 transition-colors"
                  >
                    Add Income
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showInvestmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Investment</h2>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Investment Name"
                  value={investmentData.name}
                  onChange={(e) => setInvestmentData({...investmentData, name: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                
                <select
                  value={investmentData.type}
                  onChange={(e) => setInvestmentData({...investmentData, type: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="stocks">Stocks</option>
                  <option value="bonds">Bonds</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="index-funds">Index Funds</option>
                  <option value="etf">ETFs</option>
                  <option value="commodities">Commodities</option>
                  <option value="business">Business Investment</option>
                </select>
                
                <input
                  type="number"
                  placeholder="Investment Amount"
                  value={investmentData.amount}
                  onChange={(e) => setInvestmentData({...investmentData, amount: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                
                <input
                  type="number"
                  placeholder="Expected Return % (Annual)"
                  value={investmentData.expectedReturn}
                  onChange={(e) => setInvestmentData({...investmentData, expectedReturn: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                
                <select
                  value={investmentData.riskLevel}
                  onChange={(e) => setInvestmentData({...investmentData, riskLevel: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowInvestmentForm(false);
                      setInvestmentData({ name: '', type: 'stocks', amount: '', expectedReturn: '', riskLevel: 'medium' });
                    }}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInvestmentSubmit}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-teal-600 transition-colors"
                  >
                    Add Investment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WealthPath;