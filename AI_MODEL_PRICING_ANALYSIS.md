# AI Model Pricing Analysis & Recommendations

**Date:** January 2025  
**Purpose:** Identify cost-effective AI models for ResumeIQ features and optimize subscription pricing

---

## 📊 Current Situation

- **Current Subscription Price:** ₱599/month (regular), ₱299/month (first month discount)
- **Previous Price:** $9.99/month (regular), $4.99/month (first month discount)
- **Total AI Features:** 20+ features
- **Feature Categories:** Content enhancement, writing assistance, parsing, media processing, optimization, analytics, career guidance

---

## 💰 Recommended AI Models (Cost-Effective Options)

### 1. **Groq API** ⭐ RECOMMENDED
- **Best For:** Most text generation features
- **Models:** Llama 3.1 70B, Mixtral 8x7B
- **Pricing:** ~$0.10-$0.27 per million tokens
- **Pros:**
  - Extremely fast inference (up to 500 tokens/sec)
  - Very low cost
  - Good quality for resume-related tasks
  - No rate limits on paid plans
- **Cons:**
  - Slightly lower quality than GPT-4 for complex tasks
- **Estimated Cost per Feature:** $0.0001-$0.0003

### 2. **OpenRouter** ⭐ RECOMMENDED
- **Best For:** Aggregated access to multiple models
- **Models:** Access to 100+ models including GPT-4, Claude, Llama, etc.
- **Pricing:** Varies by model, often cheaper than direct APIs
- **Pros:**
  - Single API for multiple providers
  - Automatic failover
  - Competitive pricing
  - Easy to switch models
- **Cons:**
  - Slight markup on some models
- **Estimated Cost per Feature:** $0.0002-$0.0005

### 3. **Anthropic Claude 3 Haiku**
- **Best For:** Simple content enhancement, grammar checks
- **Pricing:** $0.25/$1.25 per million tokens (input/output)
- **Pros:**
  - Very cheap for simple tasks
  - High quality
  - Fast responses
- **Cons:**
  - Less capable than Claude 3.5 Sonnet for complex tasks
- **Estimated Cost per Feature:** $0.0002-$0.0004

### 4. **Together AI**
- **Best For:** Open-source model inference
- **Models:** Llama 2, Mistral, CodeLlama
- **Pricing:** Competitive with Groq
- **Pros:**
  - Good pricing
  - Multiple model options
- **Cons:**
  - Less established than Groq
- **Estimated Cost per Feature:** $0.0001-$0.0003

### 5. **OpenAI GPT-3.5 Turbo** (Fallback)
- **Best For:** When higher quality needed
- **Pricing:** $0.50/$1.50 per million tokens
- **Pros:**
  - Reliable and well-documented
  - Good quality
- **Cons:**
  - More expensive than alternatives
- **Estimated Cost per Feature:** $0.0005-$0.001

---

## 📈 Cost Analysis Per Feature

### Feature Usage Estimates:
- **Average Input Tokens:** 500-1,000 tokens (resume content + instructions)
- **Average Output Tokens:** 1,000-2,000 tokens (enhanced content)
- **Total per Feature Call:** ~1,500-3,000 tokens

### Cost Breakdown (Using Groq/OpenRouter):

| Feature Type | Tokens/Call | Cost/Call (Groq) | Cost/Call (OpenRouter) |
|-------------|-------------|------------------|------------------------|
| Simple Enhancement | 1,500 | $0.00015 | $0.0003 |
| Content Rewriting | 2,500 | $0.00025 | $0.0005 |
| Complex Analysis | 3,500 | $0.00035 | $0.0007 |
| Resume Parsing | 5,000 | $0.0005 | $0.001 |

### Monthly Cost Estimates per User:

**Light User (20 AI features/month):**
- Cost: $0.003-$0.01
- **Profit Margin:** 99.9%+

**Average User (50 AI features/month):**
- Cost: $0.0075-$0.025
- **Profit Margin:** 99.7%+

**Heavy User (100 AI features/month):**
- Cost: $0.015-$0.05
- **Profit Margin:** 99.5%+

**Power User (200 AI features/month):**
- Cost: $0.03-$0.10
- **Profit Margin:** 99%+

---

## 💡 Recommended Pricing Strategy

### Option 1: Single Tier (Recommended) ✅ IMPLEMENTED
- **Regular Price:** ₱599/month (PHP)
- **First Month Discount:** ₱299/month (50% off)
- **Rationale:**
  - AI costs are minimal (~₱0.56-₱5.60 per user/month, ~$0.01-$0.10 USD)
  - Provides healthy profit margin (99%+)
  - Competitive with similar services in Philippines market
  - Allows for growth and infrastructure costs
  - PHP pricing aligns with local market expectations

### Option 2: Tiered Pricing (Alternative)
- **Basic:** ₱399/month (6 features)
- **Pro:** ₱599/month (12 features)
- **Enterprise:** ₱999/month (20 features)
- **Rationale:**
  - Better segmentation
  - Higher revenue from power users
  - More complex to manage

---

## 🎯 Implementation Recommendations

### Phase 1: Start with Groq
1. Use **Groq API** with Llama 3.1 70B for most features
2. Extremely low cost ($0.10-$0.27 per million tokens)
3. Fast response times
4. Good quality for resume tasks

### Phase 2: Add OpenRouter as Backup
1. Integrate **OpenRouter** for redundancy
2. Use for premium features requiring higher quality
3. Automatic failover if Groq is unavailable

### Phase 3: Optimize Model Selection
1. Use **Claude 3 Haiku** for simple tasks (grammar, suggestions)
2. Use **Groq** for content generation
3. Use **GPT-3.5 Turbo** only when needed for complex analysis

---

## 📊 Profitability Analysis

### Previous Pricing ($9.99/month USD):
- **AI Costs:** ~$0.01-$0.10/user/month (~₱0.56-₱5.60)
- **Gross Profit:** ~$9.89-$9.98/user/month
- **Profit Margin:** ~99%

### Current Pricing (₱599/month PHP):
- **AI Costs:** ~₱0.56-₱5.60/user/month (~$0.01-$0.10 USD)
- **Gross Profit:** ~₱593.40-₱598.44/user/month
- **Profit Margin:** ~99.1%
- **Exchange Rate Reference:** ~₱56 PHP per $1 USD

### Break-Even Analysis:
- Even with 200 AI features/month per user, costs are <₱5.60 (<$0.10 USD)
- Break-even point: ~₱11.20/month (extremely safe margin)
- Current price of ₱599 provides 53x cost coverage

---

## 🔒 Risk Mitigation

1. **Rate Limiting:** Implement per-user rate limits to prevent abuse
2. **Caching:** Cache common responses to reduce API calls
3. **Model Switching:** Easy switch between providers if pricing changes
4. **Monitoring:** Track API costs per user to identify anomalies

---

## ✅ Final Recommendation

**Recommended Model:** Groq API (primary) + OpenRouter (backup)  
**Current Price:** ₱599/month (regular), ₱299/month (first month)  
**Expected Profit Margin:** 99%+  
**Risk Level:** Very Low

This pricing strategy ensures:
- ✅ High profitability (99%+ margins)
- ✅ Competitive pricing in the market
- ✅ Room for growth and infrastructure costs
- ✅ Ability to handle heavy users
- ✅ Sustainable business model

---

**Last Updated:** January 2025

