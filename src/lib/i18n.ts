export type Language = 'fr' | 'en' | 'ar';

export const translations = {
  fr: {
    nav: {
      features: 'Fonctionnalités',
      pricing: 'Tarifs',
      dashboard: 'Dashboard',
      leaderboard: 'Classement',
      community: 'Communauté',
      masterclass: 'MasterClass',
      login: 'Connexion',
      register: "S'inscrire",
      startChallenge: 'Commencer le Challenge'
    },
    hero: {
      badge: 'Plateforme de Prop Trading #1 en Afrique',
      title: 'Devenez un Trader',
      titleHighlight: 'Financé',
      subtitle: 'TradeSense AI combine analyses IA en temps réel, outils de trading intelligents et éducation MasterClass premium dans un écosystème puissant.',
      cta: 'Commencer le Challenge',
      ctaSecondary: 'Voir la Démo',
      stats: {
        traders: 'Traders Actifs',
        funded: 'Traders Financés',
        payout: 'Payouts Distribués'
      }
    },
    features: {
      title: 'Pourquoi Choisir TradeSense AI',
      subtitle: 'Une plateforme unique pour le trading, l\'apprentissage et la communauté',
      ai: {
        title: 'Trading Propulsé par l\'IA',
        description: 'Signaux Achat/Vente en temps réel, Plans de Trade personnalisés et Alertes de Risque intelligentes.'
      },
      news: {
        title: 'Hub d\'Actualités en Direct',
        description: 'Actualités financières en temps réel et résumés de marché créés par l\'IA.'
      },
      community: {
        title: 'Zone Communautaire',
        description: 'Discutez avec des traders, partagez des stratégies et apprenez des experts.'
      },
      masterclass: {
        title: 'Centre MasterClass',
        description: 'Cours du débutant à l\'avancé, webinaires en direct et défis pratiques.'
      }
    },
    community: {
      title: 'Zone Communautaire',
      subtitle: 'Discutez avec des amis, partagez des stratégies et apprenez des experts.',
      groupsTitle: 'Groupes thématiques',
      chatTitle: 'Discussion',
      inputPlaceholder: 'Écrire un message...',
      send: 'Envoyer',
      createGroup: 'Créer un groupe',
      empty: 'Aucun message pour l’instant.'
    },
    masterclass: {
      badge: 'Centre d\'Apprentissage MasterClass',
      title: 'MasterClass',
      subtitle: 'TradeSense AI inclut une académie complète de haute qualité.',
      features: {
        lessons: { title: 'Leçons de trading', description: 'Du débutant à l\'avancé.' },
        analysis: { title: 'Analyse technique & fondamentale', description: 'Outils et méthodologies.' },
        riskWorkshops: { title: 'Ateliers de gestion des risques', description: 'Discipline et contrôle des pertes.' },
        liveWebinars: { title: 'Webinaires en direct', description: 'Avec des experts du marché.' },
        aiPaths: { title: 'Parcours IA', description: 'Guidage assisté par IA.' },
        challengesQuizzes: { title: 'Défis & Quiz', description: 'Pratique et évaluation.' }
      },
      catalog: {
        title: 'Catalogue des cours',
        total: '{n} cours',
        cta: 'Commencer'
      },
      level: {
        beginner: 'Débutant',
        intermediate: 'Intermédiaire',
        advanced: 'Avancé'
      },
      webinars: {
        title: 'Webinaires à venir',
        host: 'Animé par {name}',
        cta: 'S\'inscrire'
      },
      paths: {
        title: 'Parcours d\'apprentissage',
        cta: 'Commencer le parcours',
        beginner: { title: 'Parcours Débutant', desc: 'Bases et principes.' },
        advanced: { title: 'Parcours Avancé', desc: 'Stratégies et exécution.' }
      }
    },
    pricing: {
      title: 'Choisissez Votre Challenge',
      subtitle: 'Prouvez vos compétences et accédez au financement',
      starter: {
        name: 'Starter',
        price: '200',
        balance: '5 000 $',
        features: ['Solde virtuel de 5 000 $', 'Objectif de profit: 10%', 'Perte max journalière: 5%', 'Perte max totale: 10%', 'Signaux IA de base']
      },
      pro: {
        name: 'Pro',
        price: '500',
        balance: '25 000 $',
        features: ['Solde virtuel de 25 000 $', 'Objectif de profit: 10%', 'Perte max journalière: 5%', 'Perte max totale: 10%', 'Signaux IA avancés', 'Accès MasterClass']
      },
      elite: {
        name: 'Elite',
        price: '1000',
        balance: '100 000 $',
        features: ['Solde virtuel de 100 000 $', 'Objectif de profit: 10%', 'Perte max journalière: 5%', 'Perte max totale: 10%', 'Signaux IA premium', 'MasterClass complète', 'Support prioritaire']
      },
      cta: 'Commencer',
      popular: 'Plus Populaire'
    },
    dashboard: {
      title: 'Dashboard Trading',
      balance: 'Solde',
      equity: 'Équité',
      profit: 'Profit/Perte',
      trades: 'Trades',
      buy: 'Acheter',
      sell: 'Vendre',
      signals: 'Signaux IA',
      status: {
        active: 'Actif',
        passed: 'Réussi',
        failed: 'Échoué',
        pending: 'En attente',
        cancelled: 'Annulé'
      },
      phase: {
        phase1: 'Phase 1',
        phase2: 'Phase 2',
        funded: 'Financé'
      },
      labels: {
        lastUpdate: 'Dernière mise à jour',
        currentPrice: 'Prix actuel',
        quantity: 'Quantité',
        totalAmount: 'Montant total',
        currentBalance: 'Solde actuel',
        cancel: 'Annuler',
        sending: 'Envoi...',
        recentTrades: 'Trades récents',
        markets: 'Marchés',
        loadingData: 'Chargement des données...',
        riskAlert: 'Alerte Risque',
        monitoring: 'Surveillance en cours',
        aiTradePlan: 'Plan de Trade IA',
        opportunities: 'Opportunités de Qualité',
        entry: 'Entrée',
        sl: 'SL',
        tp: 'TP',
        confidence: 'Confiance',
        risk: 'Risque',
        invalidation: 'Invalidation',
        rr: 'Ratio R/R',
        maxLoss: 'Perte max',
        remaining: 'restant',
        target: 'Objectif',
        reached: 'atteint',
        portfolio: 'Portefeuille',
        capitalEarned: 'Capital acquis',
        payoutRate: 'Partage profits',
        potentialPayout: 'Payout potentiel',
        table: {
          symbol: 'Symbole',
          quantity: 'Qté',
          avgPrice: 'Prix moyen',
          marketPrice: 'Prix marché',
          value: 'Valeur',
          pl: 'P/L'
        }
      }
    },
    leaderboard: {
      title: 'Top 10 Traders du Mois',
      subtitle: 'Les meilleurs traders de notre communauté',
      rank: 'Rang',
      trader: 'Trader',
      profit: 'Profit',
      trades: 'Trades',
      winRate: 'Taux de Réussite'
    },
    auth: {
      login: 'Connexion',
      register: 'Inscription',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      name: 'Nom complet',
      forgotPassword: 'Mot de passe oublié?',
      noAccount: 'Pas encore de compte?',
      hasAccount: 'Déjà un compte?',
      signUp: "S'inscrire",
      signIn: 'Se connecter'
    },
    footer: {
      description: 'La première Prop Firm assistée par IA pour l\'Afrique.',
      legal: 'Légal',
      terms: 'Conditions',
      privacy: 'Confidentialité',
      support: 'Support',
      contact: 'Contact',
      faq: 'FAQ'
    }
  },
  en: {
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      dashboard: 'Dashboard',
      leaderboard: 'Leaderboard',
      community: 'Community',
      masterclass: 'MasterClass',
      login: 'Login',
      register: 'Register',
      startChallenge: 'Start Challenge'
    },
    hero: {
      badge: '#1 Prop Trading Platform in Africa',
      title: 'Become a',
      titleHighlight: 'Funded Trader',
      subtitle: 'TradeSense AI combines real-time AI analysis, smart trading tools and premium MasterClass education in a powerful ecosystem.',
      cta: 'Start Challenge',
      ctaSecondary: 'Watch Demo',
      stats: {
        traders: 'Active Traders',
        funded: 'Funded Traders',
        payout: 'Payouts Distributed'
      }
    },
    features: {
      title: 'Why Choose TradeSense AI',
      subtitle: 'One platform for trading, learning and community',
      ai: {
        title: 'AI-Powered Trading',
        description: 'Real-time Buy/Sell signals, personalized Trade Plans and smart Risk Alerts.'
      },
      news: {
        title: 'Live News Hub',
        description: 'Real-time financial news and AI-generated market summaries.'
      },
      community: {
        title: 'Community Zone',
        description: 'Chat with traders, share strategies and learn from experts.'
      },
      masterclass: {
        title: 'MasterClass Center',
        description: 'Beginner to advanced courses, live webinars and practical challenges.'
      }
    },
    community: {
      title: 'Community Zone',
      subtitle: 'Chat with friends, share strategies and learn from experts.',
      groupsTitle: 'Topic groups',
      chatTitle: 'Chat',
      inputPlaceholder: 'Write a message...',
      send: 'Send',
      createGroup: 'Create group',
      empty: 'No messages yet.'
    },
    masterclass: {
      badge: 'MasterClass Learning Center',
      title: 'MasterClass',
      subtitle: 'TradeSense AI includes a complete, high-quality academy.',
      features: {
        lessons: { title: 'Trading lessons', description: 'From beginner to advanced.' },
        analysis: { title: 'Technical & fundamental analysis', description: 'Tools and methods.' },
        riskWorkshops: { title: 'Risk management workshops', description: 'Discipline and loss control.' },
        liveWebinars: { title: 'Live webinars', description: 'With market experts.' },
        aiPaths: { title: 'AI learning paths', description: 'AI-guided progress.' },
        challengesQuizzes: { title: 'Challenges & quizzes', description: 'Practice and assessment.' }
      },
      catalog: {
        title: 'Course catalog',
        total: '{n} courses',
        cta: 'Start'
      },
      level: {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced'
      },
      webinars: {
        title: 'Upcoming webinars',
        host: 'Hosted by {name}',
        cta: 'Register'
      },
      paths: {
        title: 'Learning paths',
        cta: 'Start path',
        beginner: { title: 'Beginner Path', desc: 'Basics and principles.' },
        advanced: { title: 'Advanced Path', desc: 'Strategies and execution.' }
      }
    },
    pricing: {
      title: 'Choose Your Challenge',
      subtitle: 'Prove your skills and get funded',
      starter: {
        name: 'Starter',
        price: '200',
        balance: '$5,000',
        features: ['$5,000 virtual balance', 'Profit target: 10%', 'Max daily loss: 5%', 'Max total loss: 10%', 'Basic AI signals']
      },
      pro: {
        name: 'Pro',
        price: '500',
        balance: '$25,000',
        features: ['$25,000 virtual balance', 'Profit target: 10%', 'Max daily loss: 5%', 'Max total loss: 10%', 'Advanced AI signals', 'MasterClass access']
      },
      elite: {
        name: 'Elite',
        price: '1000',
        balance: '$100,000',
        features: ['$100,000 virtual balance', 'Profit target: 10%', 'Max daily loss: 5%', 'Max total loss: 10%', 'Premium AI signals', 'Full MasterClass', 'Priority support']
      },
      cta: 'Get Started',
      popular: 'Most Popular'
    },
    dashboard: {
      title: 'Trading Dashboard',
      balance: 'Balance',
      equity: 'Equity',
      profit: 'Profit/Loss',
      trades: 'Trades',
      buy: 'Buy',
      sell: 'Sell',
      signals: 'AI Signals',
      status: {
        active: 'Active',
        passed: 'Passed',
        failed: 'Failed',
        pending: 'Pending',
        cancelled: 'Cancelled'
      },
      phase: {
        phase1: 'Phase 1',
        phase2: 'Phase 2',
        funded: 'Funded'
      },
      labels: {
        lastUpdate: 'Last update',
        currentPrice: 'Current price',
        quantity: 'Quantity',
        totalAmount: 'Total amount',
        currentBalance: 'Current balance',
        cancel: 'Cancel',
        sending: 'Sending...',
        recentTrades: 'Recent trades',
        markets: 'Markets',
        loadingData: 'Loading data...',
        riskAlert: 'Risk Alert',
        monitoring: 'Monitoring...',
        aiTradePlan: 'AI Trade Plan',
        opportunities: 'Quality Opportunities',
        entry: 'Entry',
        sl: 'SL',
        tp: 'TP',
        confidence: 'Confidence',
        risk: 'Risk',
        invalidation: 'Invalidation',
        rr: 'R/R Ratio',
        maxLoss: 'Max loss',
        remaining: 'remaining',
        target: 'Target',
        reached: 'reached',
        portfolio: 'Portfolio',
        capitalEarned: 'Capital earned',
        payoutRate: 'Profit split',
        potentialPayout: 'Potential payout',
        table: {
          symbol: 'Symbol',
          quantity: 'Qty',
          avgPrice: 'Avg price',
          marketPrice: 'Market price',
          value: 'Value',
          pl: 'P/L'
        }
      }
    },
    leaderboard: {
      title: 'Top 10 Traders of the Month',
      subtitle: 'Best traders in our community',
      rank: 'Rank',
      trader: 'Trader',
      profit: 'Profit',
      trades: 'Trades',
      winRate: 'Win Rate'
    },
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      name: 'Full Name',
      forgotPassword: 'Forgot password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      signUp: 'Sign Up',
      signIn: 'Sign In'
    },
    footer: {
      description: 'The first AI-powered Prop Firm for Africa.',
      legal: 'Legal',
      terms: 'Terms',
      privacy: 'Privacy',
      support: 'Support',
      contact: 'Contact',
      faq: 'FAQ'
    }
  },
  ar: {
    nav: {
      features: 'المميزات',
      pricing: 'الأسعار',
      dashboard: 'لوحة التحكم',
      leaderboard: 'الترتيب',
      community: 'المجتمع',
      masterclass: 'الماستركلاس',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      startChallenge: 'ابدأ التحدي'
    },
    hero: {
      badge: 'منصة التداول الأولى في أفريقيا',
      title: 'كن متداولاً',
      titleHighlight: 'ممولاً',
      subtitle: 'تجمع TradeSense AI بين تحليلات الذكاء الاصطناعي وأدوات التداول الذكية والتعليم المتميز.',
      cta: 'ابدأ التحدي',
      ctaSecondary: 'شاهد العرض',
      stats: {
        traders: 'متداولون نشطون',
        funded: 'متداولون ممولون',
        payout: 'أرباح موزعة'
      }
    },
    features: {
      title: 'لماذا TradeSense AI',
      subtitle: 'منصة واحدة للتداول والتعلم والمجتمع',
      ai: {
        title: 'تداول بالذكاء الاصطناعي',
        description: 'إشارات شراء/بيع فورية وخطط تداول مخصصة وتنبيهات المخاطر.'
      },
      news: {
        title: 'مركز الأخبار',
        description: 'أخبار مالية فورية وملخصات السوق بالذكاء الاصطناعي.'
      },
      community: {
        title: 'منطقة المجتمع',
        description: 'تحدث مع المتداولين وشارك الاستراتيجيات وتعلم من الخبراء.'
      },
      masterclass: {
        title: 'مركز الماستركلاس',
        description: 'دورات من المبتدئ إلى المتقدم وندوات مباشرة وتحديات عملية.'
      }
    },
    community: {
      title: 'منطقة المجتمع',
      subtitle: 'تحدث مع الأصدقاء وشارك الاستراتيجيات وتعلم من الخبراء.',
      groupsTitle: 'مجموعات موضوعية',
      chatTitle: 'الدردشة',
      inputPlaceholder: 'اكتب رسالة...',
      send: 'إرسال',
      createGroup: 'إنشاء مجموعة',
      empty: 'لا توجد رسائل بعد.'
    },
    masterclass: {
      badge: 'مركز تعلم الماستركلاس',
      title: 'الماستركلاس',
      subtitle: 'تشمل TradeSense AI أكاديمية كاملة عالية الجودة.',
      features: {
        lessons: { title: 'دروس التداول', description: 'من المبتدئ إلى المتقدم.' },
        analysis: { title: 'التحليل الفني والأساسي', description: 'أدوات ومنهجيات.' },
        riskWorkshops: { title: 'ورش إدارة المخاطر', description: 'انضباط وسيطرة على الخسائر.' },
        liveWebinars: { title: 'ندوات مباشرة', description: 'مع خبراء السوق.' },
        aiPaths: { title: 'مسارات تعلم بالذكاء الاصطناعي', description: 'تقدم موجه بالذكاء الاصطناعي.' },
        challengesQuizzes: { title: 'تحديات واختبارات', description: 'ممارسة وتقييم.' }
      },
      catalog: {
        title: 'كتالوج الدورات',
        total: '{n} دورة',
        cta: 'ابدأ'
      },
      level: {
        beginner: 'مبتدئ',
        intermediate: 'متوسط',
        advanced: 'متقدم'
      },
      webinars: {
        title: 'ندوات قادمة',
        host: 'يقدمه {name}',
        cta: 'سجّل'
      },
      paths: {
        title: 'مسارات التعلم',
        cta: 'ابدأ المسار',
        beginner: { title: 'مسار المبتدئ', desc: 'الأساسيات والمبادئ.' },
        advanced: { title: 'مسار المتقدم', desc: 'الاستراتيجيات والتنفيذ.' }
      }
    },
    pricing: {
      title: 'اختر تحديك',
      subtitle: 'أثبت مهاراتك واحصل على التمويل',
      starter: {
        name: 'المبتدئ',
        price: '200',
        balance: '5,000 $',
        features: ['رصيد افتراضي 5,000 $', 'هدف الربح: 10%', 'الخسارة اليومية القصوى: 5%', 'الخسارة الإجمالية القصوى: 10%', 'إشارات IA أساسية']
      },
      pro: {
        name: 'المحترف',
        price: '500',
        balance: '25,000 $',
        features: ['رصيد افتراضي 25,000 $', 'هدف الربح: 10%', 'الخسارة اليومية القصوى: 5%', 'الخسارة الإجمالية القصوى: 10%', 'إشارات IA متقدمة', 'وصول الماستركلاس']
      },
      elite: {
        name: 'النخبة',
        price: '1000',
        balance: '100,000 $',
        features: ['رصيد افتراضي 100,000 $', 'هدف الربح: 10%', 'الخسارة اليومية القصوى: 5%', 'الخسارة الإجمالية القصوى: 10%', 'إشارات IA مميزة', 'ماستركلاس كامل', 'دعم أولوية']
      },
      cta: 'ابدأ الآن',
      popular: 'الأكثر شعبية'
    },
    dashboard: {
      title: 'لوحة التداول',
      balance: 'الرصيد',
      equity: 'الملكية',
      profit: 'الربح/الخسارة',
      trades: 'الصفقات',
      buy: 'شراء',
      sell: 'بيع',
      signals: 'إشارات IA',
      status: {
        active: 'نشط',
        passed: 'ناجح',
        failed: 'فاشل',
        pending: 'قيد الانتظار',
        cancelled: 'ملغى'
      },
      phase: {
        phase1: 'المرحلة 1',
        phase2: 'المرحلة 2',
        funded: 'ممول'
      },
      labels: {
        lastUpdate: 'آخر تحديث',
        currentPrice: 'السعر الحالي',
        quantity: 'الكمية',
        totalAmount: 'المبلغ الإجمالي',
        currentBalance: 'الرصيد الحالي',
        cancel: 'إلغاء',
        sending: 'جارٍ الإرسال...',
        recentTrades: 'الصفقات الأخيرة',
        markets: 'الأسواق',
        loadingData: 'جارٍ تحميل البيانات...',
        riskAlert: 'تنبيه المخاطر',
        monitoring: 'مراقبة مستمرة',
        aiTradePlan: 'خطة تداول بالذكاء الاصطناعي',
        opportunities: 'فرص ذات جودة',
        entry: 'الدخول',
        sl: 'إيقاف الخسارة',
        tp: 'جني الأرباح',
        confidence: 'الثقة',
        risk: 'المخاطر',
        invalidation: 'إبطال',
        rr: 'نسبة ر/ر',
        maxLoss: 'الخسارة القصوى',
        remaining: 'متبقي',
        target: 'الهدف',
        reached: 'تم بلوغ',
        portfolio: 'المحفظة',
        capitalEarned: 'رأس المال المكتسب',
        payoutRate: 'نسبة مشاركة الأرباح',
        potentialPayout: 'دفع محتمل',
        table: {
          symbol: 'الرمز',
          quantity: 'الكمية',
          avgPrice: 'السعر المتوسط',
          marketPrice: 'سعر السوق',
          value: 'القيمة',
          pl: 'الربح/الخسارة'
        }
      }
    },
    leaderboard: {
      title: 'أفضل 10 متداولين هذا الشهر',
      subtitle: 'أفضل المتداولين في مجتمعنا',
      rank: 'المرتبة',
      trader: 'المتداول',
      profit: 'الربح',
      trades: 'الصفقات',
      winRate: 'نسبة النجاح'
    },
    auth: {
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      name: 'الاسم الكامل',
      forgotPassword: 'نسيت كلمة المرور؟',
      noAccount: 'ليس لديك حساب؟',
      hasAccount: 'لديك حساب بالفعل؟',
      signUp: 'إنشاء حساب',
      signIn: 'تسجيل الدخول'
    },
    footer: {
      description: 'أول شركة Prop مدعومة بالذكاء الاصطناعي في أفريقيا.',
      legal: 'قانوني',
      terms: 'الشروط',
      privacy: 'الخصوصية',
      support: 'الدعم',
      contact: 'اتصل بنا',
      faq: 'الأسئلة الشائعة'
    }
  }
};

export type Translations = typeof translations.fr;
