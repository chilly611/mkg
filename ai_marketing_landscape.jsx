import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, ExternalLink, Filter, Globe, Layers, Sparkles, ArrowUpRight } from 'lucide-react';

// ============================================================
// COMPETITIVE LANDSCAPE DATA — AI Marketing & Advertising 2026
// ============================================================

const CATEGORIES = {
  GEO: { name: 'Generative Engine Optimization', short: 'GEO / AEO', tone: 'critical' },
  AD_CREATIVE: { name: 'AI Ad Creative', short: 'Ad Creative' },
  UGC_AVATAR: { name: 'AI UGC & Avatars', short: 'UGC / Avatars' },
  VIDEO_GEN: { name: 'AI Video Generation', short: 'Video Gen' },
  AGENTS: { name: 'Autonomous Marketing Agents', short: 'AI Agents', tone: 'critical' },
  COPY: { name: 'AI Copywriting', short: 'Copywriting' },
  SEO_CONTENT: { name: 'AI SEO Content', short: 'SEO Content' },
  EMAIL_LIFECYCLE: { name: 'Email & Lifecycle', short: 'Email / CRM' },
  CHAT: { name: 'Conversational / Chatbots', short: 'Conversational' },
  PERSONALIZATION: { name: 'Personalization & On-Site', short: 'Personalization' },
  PROGRAMMATIC: { name: 'Programmatic & Cross-Channel', short: 'Programmatic' },
  AGENCY: { name: 'AI Marketing Agencies', short: 'Agencies' },
  WORKFLOW: { name: 'Workflow Automation', short: 'Workflow' },
  INCUMBENT: { name: 'Incumbent Platforms (with AI)', short: 'Incumbents' },
  VOICE: { name: 'Voice AI Agents', short: 'Voice AI' },
  WHATSAPP: { name: 'Messaging / WhatsApp', short: 'Messaging' },
  AGENTIC_COMMERCE: { name: 'Agentic Commerce', short: 'Buying Agents', tone: 'critical' },
  CREATIVE_OPS: { name: 'Creative Operations', short: 'Creative Ops' },
  INFLUENCER: { name: 'Creator / Influencer', short: 'Creator Tools' },
  SOCIAL_AI: { name: 'Social Media AI', short: 'Social' }
};

const REGIONS = {
  NA: { name: 'North America', flag: '🇺🇸' },
  EU: { name: 'Europe / UK', flag: '🇪🇺' },
  LATAM: { name: 'Latin America', flag: '🌎' },
  ASIA: { name: 'Asia', flag: '🌏' },
  CIS: { name: 'Russia / CIS', flag: '🇷🇺' },
  MEA: { name: 'Middle East / Africa', flag: '🌍' },
  GLOBAL: { name: 'Global', flag: '🌐' }
};

// Each company: { name, domain, cats[], region, blurb, vertical?, tier? }
// tier 'A' = pinned/category leader  |  'B' = standard
const COMPANIES = [
  // ==== GEO / LLM SEARCH VISIBILITY ====
  { name: 'Profound', domain: 'tryprofound.com', cats: ['GEO'], region: 'NA', tier: 'A', blurb: 'Enterprise GEO platform with deep AI crawler analytics across 10+ engines. Backed by sequoia-class funding.' },
  { name: 'AthenaHQ', domain: 'athenahq.ai', cats: ['GEO'], region: 'NA', tier: 'A', blurb: 'Founded by ex-Google Search & DeepMind engineers. Tracks brand appearance across ChatGPT, Perplexity, Claude, Gemini.' },
  { name: 'Evertune', domain: 'evertune.ai', cats: ['GEO'], region: 'NA', tier: 'A', blurb: 'Direct API access to foundation models + 1M+ monthly prompts per brand. Built by Trade Desk veterans.' },
  { name: 'Otterly.ai', domain: 'otterly.ai', cats: ['GEO'], region: 'EU', blurb: 'Austrian GEO monitoring platform. Affordable entry point ($29/mo) tracking 6 LLM platforms.' },
  { name: 'Peec.AI', domain: 'peec.ai', cats: ['GEO'], region: 'EU', blurb: 'Multilingual AI visibility tracking — 115+ languages with regional benchmarking.' },
  { name: 'Scrunch AI', domain: 'scrunchai.com', cats: ['GEO'], region: 'NA', blurb: 'Multi-LLM coverage including Grok, Meta AI, WhatsApp AI. Citation analytics + agent visibility.' },
  { name: 'Goodie AI', domain: 'goodie.ai', cats: ['GEO', 'SEO_CONTENT'], region: 'NA', blurb: 'End-to-end AEO platform built natively for AI search rather than retrofitted from SEO.' },
  { name: 'Brandi AI', domain: 'mybrandi.ai', cats: ['GEO'], region: 'NA', blurb: 'Built by 20-year B2B SaaS marketing veteran. AI Visibility Scorecard + on-page recommendations.' },
  { name: 'Mersel AI', domain: 'mersel.ai', cats: ['GEO', 'AGENCY'], region: 'NA', blurb: 'Managed GEO service. Combines monitoring with content production and infrastructure deployment.' },
  { name: 'AIVO', domain: 'tryaivo.com', cats: ['GEO'], region: 'NA', blurb: 'AI visibility intelligence with action recommendations layered on monitoring.' },
  { name: 'Gauge', domain: 'trygauge.ai', cats: ['GEO'], region: 'NA', blurb: 'Track / Understand / Act workflow with deep citation analytics + agentic content engine.' },
  { name: 'Frase', domain: 'frase.io', cats: ['GEO', 'SEO_CONTENT'], region: 'NA', tier: 'A', blurb: 'Covers all 6 stages of SEO/GEO content pipeline. MCP server for agent workflows + Content Watchdog.' },
  { name: 'Conductor', domain: 'conductor.com', cats: ['GEO', 'SEO_CONTENT'], region: 'NA', blurb: 'Enterprise SEO platform with Conductor AI for generative search. Acquired Searchmetrics.' },
  { name: 'BrightEdge', domain: 'brightedge.com', cats: ['GEO', 'SEO_CONTENT'], region: 'NA', blurb: 'Trusted by half of Fortune 500. DataMind AI engine + AI Catalyst for generative search visibility.' },
  { name: 'Contently', domain: 'contently.com', cats: ['GEO', 'SEO_CONTENT'], region: 'NA', blurb: 'Enterprise content marketing platform with AI Studio + LLM Optimization Blueprint.' },
  { name: 'LSEO', domain: 'lseo.com', cats: ['GEO', 'AGENCY'], region: 'NA', blurb: '$1M+ R&D into proprietary DIYSEO.AI platform. Founded by Pepperjam founder Kris Jones.' },
  { name: 'Promptwatch', domain: 'promptwatch.io', cats: ['GEO'], region: 'NA', blurb: 'Closes the loop: gap analysis → AI content generation → traffic attribution.' },
  { name: 'Botify', domain: 'botify.com', cats: ['GEO', 'SEO_CONTENT'], region: 'EU', blurb: 'Paris-based GEO platform. Customers include Macy\'s and The New York Times.' },
  { name: 'Omnius', domain: 'omnius.so', cats: ['GEO', 'AGENCY'], region: 'EU', blurb: 'Croatian GEO agency. Proprietary AtomicAGI software with 20+ distinct GEO tactics.' },
  { name: 'Ahrefs Brand Radar', domain: 'ahrefs.com', cats: ['GEO', 'SEO_CONTENT'], region: 'ASIA', blurb: 'Singapore-based. 218M+ monthly real prompts dataset for AI search visibility.' },
  { name: 'Semrush', domain: 'semrush.com', cats: ['GEO', 'SEO_CONTENT'], region: 'NA', tier: 'A', blurb: 'AI Toolkit added to long-standing SEO suite. AI Overview monitoring + prompt tracking.' },
  { name: 'HubSpot AI Search Grader', domain: 'hubspot.com', cats: ['GEO'], region: 'NA', blurb: 'Free GEO grader. Useful entry point for SMBs evaluating AI visibility.' },
  { name: 'Disruptive Advertising', domain: 'disruptiveadvertising.com', cats: ['GEO', 'AGENCY'], region: 'NA', blurb: 'Top GEO agency. Entity Authority approach + proprietary LLM tracking tools.' },
  { name: 'First Page Sage', domain: 'firstpagesage.com', cats: ['GEO', 'AGENCY'], region: 'NA', blurb: 'GEO agency curating top firms across real estate, law, healthcare, education.' },

  // ==== AI AD CREATIVE ====
  { name: 'AdCreative.ai', domain: 'adcreative.ai', cats: ['AD_CREATIVE'], region: 'EU', tier: 'A', blurb: 'Predictive performance scoring before launch. Conversion-focused AI ads at scale.' },
  { name: 'AdStellar', domain: 'adstellar.ai', cats: ['AD_CREATIVE', 'PROGRAMMATIC'], region: 'NA', blurb: 'Full-stack Meta ads. Generates UGC, image, video creatives → builds + launches campaigns.' },
  { name: 'Pencil', domain: 'trypencil.com', cats: ['AD_CREATIVE', 'VIDEO_GEN'], region: 'NA', blurb: 'AI video ad platform with performance prediction. Built for DTC + ecommerce.' },
  { name: 'Omneky', domain: 'omneky.com', cats: ['AD_CREATIVE', 'AGENCY'], region: 'NA', tier: 'A', blurb: 'Backed by OpenAI Startup Fund. Generates thousands of creative variations + auto-replaces underperformers.' },
  { name: 'Smartly.io', domain: 'smartly.io', cats: ['AD_CREATIVE', 'PROGRAMMATIC'], region: 'EU', tier: 'A', blurb: 'Finnish enterprise creative automation. Dynamic Creative Optimization across Meta, Google, Pinterest.' },
  { name: 'Synter', domain: 'syntermedia.ai', cats: ['AD_CREATIVE', 'PROGRAMMATIC'], region: 'NA', blurb: 'Cross-channel via 14 platforms (Google, Meta, LinkedIn, TikTok, Reddit, Pinterest, Amazon DSP, etc.) + 100 MCP tools.' },
  { name: 'Predis.ai', domain: 'predis.ai', cats: ['AD_CREATIVE', 'SOCIAL_AI'], region: 'ASIA', blurb: 'Indian platform. Social ad creative + competitor analysis + content scheduling.' },
  { name: 'Hunch', domain: 'hunch.tools', cats: ['AD_CREATIVE'], region: 'NA', blurb: 'Automated creative production for paid social. Direct Meta integration + DCO at scale.' },
  { name: 'Creatify', domain: 'creatify.ai', cats: ['VIDEO_GEN', 'UGC_AVATAR'], region: 'NA', tier: 'A', blurb: 'URL-to-video automation. Aurora model for AI avatar realism. Strong product-image-to-video flow.' },
  { name: 'AdsGency AI', domain: 'adsgency.ai', cats: ['AD_CREATIVE', 'PROGRAMMATIC'], region: 'NA', blurb: 'Unified ad creation, targeting, automation, analytics with Google + Meta sync.' },
  { name: 'Persado', domain: 'persado.com', cats: ['COPY', 'AD_CREATIVE'], region: 'NA', blurb: 'Enterprise generative AI for marketing language. Used by JPMorgan Chase et al.' },
  { name: 'Bannerflow', domain: 'bannerflow.com', cats: ['AD_CREATIVE', 'CREATIVE_OPS'], region: 'EU', blurb: 'Swedish creative production platform. Scaled DCO + brand consistency across markets.' },
  { name: 'Superside', domain: 'superside.com', cats: ['AGENCY', 'CREATIVE_OPS'], region: 'EU', tier: 'A', blurb: 'Norwegian AI-powered creative service. Subscription model. Superside AI handles concept → asset.' },
  { name: 'PicsArt', domain: 'picsart.com', cats: ['AD_CREATIVE', 'CREATIVE_OPS'], region: 'EU', blurb: 'Armenian visual AI giant. Generative templates + brand assets + ad copy generation.' },

  // ==== AI UGC / SYNTHETIC AVATARS / VIDEO ====
  { name: 'Synthesia', domain: 'synthesia.io', cats: ['UGC_AVATAR', 'VIDEO_GEN'], region: 'EU', tier: 'A', blurb: 'UK leader. ~$530M raised, $4B valuation. AI avatars for enterprise training, marketing, comms.' },
  { name: 'HeyGen', domain: 'heygen.com', cats: ['UGC_AVATAR', 'VIDEO_GEN'], region: 'NA', tier: 'A', blurb: '1,100+ avatars. Voice cloning + instant translation with lip-sync in 175+ languages.' },
  { name: 'Arcads', domain: 'arcads.ai', cats: ['UGC_AVATAR', 'AD_CREATIVE'], region: 'NA', tier: 'A', blurb: '1,000+ controllable AI actors with emotion control. Built for high-volume UGC ad testing.' },
  { name: 'Runway', domain: 'runwayml.com', cats: ['VIDEO_GEN', 'CREATIVE_OPS'], region: 'NA', tier: 'A', blurb: 'Frontier text-to-video and image-to-video. Gen-3 Alpha model used by major studios.' },
  { name: 'LensGo (Seedance 2.0)', domain: 'lensgo.ai', cats: ['VIDEO_GEN', 'UGC_AVATAR'], region: 'ASIA', blurb: 'ByteDance\'s Seedance model. Native synced audio + product image input. 6 aspect ratios.' },
  { name: 'Tagshop AI', domain: 'tagshop.ai', cats: ['UGC_AVATAR'], region: 'ASIA', blurb: 'URL-to-video for ecom. 1,000+ avatars + bulk localization across 75+ languages.' },
  { name: 'MakeUGC', domain: 'makeugc.com', cats: ['UGC_AVATAR'], region: 'NA', blurb: 'Lightweight AI UGC for individuals and small marketing teams.' },
  { name: 'D-ID', domain: 'd-id.com', cats: ['UGC_AVATAR', 'VIDEO_GEN'], region: 'EU', blurb: 'Israeli/EU. AI presenter platform for sales, support, content.' },
  { name: 'Elai', domain: 'elai.io', cats: ['UGC_AVATAR', 'VIDEO_GEN'], region: 'EU', blurb: 'European AI video generation for L&D and enterprise comms.' },
  { name: 'Pictory', domain: 'pictory.ai', cats: ['VIDEO_GEN'], region: 'NA', blurb: 'Long-form to short-form video with auto highlights + summaries.' },
  { name: 'Colossyan', domain: 'colossyan.com', cats: ['UGC_AVATAR', 'VIDEO_GEN'], region: 'EU', blurb: 'UK AI video for L&D. SCORM export + interactivity for corporate training.' },
  { name: 'Luma AI', domain: 'lumalabs.ai', cats: ['VIDEO_GEN'], region: 'NA', blurb: 'Cutting-edge realism for visual creators. Dream Machine for text-to-video.' },
  { name: 'Higgsfield', domain: 'higgsfield.ai', cats: ['VIDEO_GEN', 'UGC_AVATAR'], region: 'NA', blurb: 'Performance-marketing video generation with batch testing for ad teams.' },
  { name: 'Invideo AI', domain: 'invideo.io', cats: ['VIDEO_GEN'], region: 'ASIA', blurb: 'Indian-origin. Text-to-video assembling stock footage + AI voiceover + captions.' },
  { name: 'Captions', domain: 'captions.ai', cats: ['VIDEO_GEN', 'UGC_AVATAR'], region: 'NA', blurb: 'AI editing + lip dub for human-recorded UGC. Affordable closing of quality gap.' },
  { name: 'Canva (Magic Studio)', domain: 'canva.com', cats: ['CREATIVE_OPS', 'AD_CREATIVE'], region: 'ASIA', blurb: 'Australian unicorn. Magic Write + Magic Design democratized design AI.' },
  { name: 'NeuralGarage', domain: 'neuralgarage.in', cats: ['VIDEO_GEN'], region: 'ASIA', blurb: 'Indian VisualDub. Sync dubbed audio with facial expressions automatically.' },

  // ==== AUTONOMOUS MARKETING AGENTS ====
  { name: 'Jasper', domain: 'jasper.ai', cats: ['AGENTS', 'COPY', 'INCUMBENT'], region: 'NA', tier: 'A', blurb: 'Evolved from writing assistant to creative agent managing content workflows + brand voice.' },
  { name: 'Agentforce (Salesforce)', domain: 'salesforce.com', cats: ['AGENTS', 'INCUMBENT'], region: 'NA', tier: 'A', blurb: 'Enterprise standard. Autonomous agents across sales/service/marketing in Salesforce ecosystem.' },
  { name: 'HubSpot Breeze', domain: 'hubspot.com', cats: ['AGENTS', 'INCUMBENT', 'EMAIL_LIFECYCLE'], region: 'NA', tier: 'A', blurb: 'Low-code AI agents inside HubSpot for content, segmentation, lifecycle automation.' },
  { name: 'NoimosAI', domain: 'noimosai.com', cats: ['AGENTS'], region: 'EU', blurb: 'European all-in-one Command Marketing platform. Memory Layer learns brand voice over time.' },
  { name: 'Albert.ai', domain: 'albert.ai', cats: ['AGENTS', 'PROGRAMMATIC'], region: 'NA', blurb: 'Veteran autonomous campaign management. Decision-making across audiences, creatives, channels.' },
  { name: 'Tofu', domain: 'tryt0fu.com', cats: ['AGENTS'], region: 'NA', blurb: 'B2B autonomous outreach with personalized account-based marketing.' },
  { name: 'Sierra AI', domain: 'sierra.ai', cats: ['AGENTS', 'CHAT'], region: 'NA', tier: 'A', blurb: 'Bret Taylor\'s startup. Goal-oriented agents with Agent Data Platform for long-term context.' },
  { name: 'Decagon', domain: 'decagon.ai', cats: ['AGENTS', 'CHAT'], region: 'NA', blurb: 'AI customer agents with deep enterprise integration.' },
  { name: 'Cognigy (NiCE)', domain: 'cognigy.com', cats: ['AGENTS', 'CHAT'], region: 'EU', blurb: 'German conversational AI. Forrester Wave Leader 2026. Now part of NiCE.' },
  { name: 'Kore.ai', domain: 'kore.ai', cats: ['AGENTS', 'CHAT'], region: 'NA', blurb: 'Top-rated agentic AI platform across all four enterprise dimensions in 2026.' },
  { name: 'Glean', domain: 'glean.com', cats: ['AGENTS'], region: 'NA', blurb: 'Enterprise search + agents. Foundation for AI-native marketing teams.' },
  { name: 'Moveworks', domain: 'moveworks.com', cats: ['AGENTS'], region: 'NA', blurb: 'Enterprise AI agents for service. Acquired by ServiceNow.' },
  { name: 'Aisera', domain: 'aisera.com', cats: ['AGENTS', 'CHAT'], region: 'NA', blurb: 'AI-powered service desk + customer agents.' },
  { name: 'SuperAGI', domain: 'superagi.com', cats: ['AGENTS'], region: 'ASIA', blurb: 'Agentic platform with engineering depth. Indian-origin.' },
  { name: 'Yarnit', domain: 'yarnit.app', cats: ['AGENTS', 'COPY'], region: 'ASIA', blurb: 'Indian agentic marketing platform with low-code automation + personalization.' },
  { name: 'Netcore Cloud', domain: 'netcorecloud.com', cats: ['AGENTS', 'EMAIL_LIFECYCLE'], region: 'ASIA', blurb: 'Indian customer engagement platform. Outcome-based pricing + AI agent suite.' },
  { name: 'Demandbase', domain: 'demandbase.com', cats: ['AGENTS'], region: 'NA', blurb: 'Agentbase for ABM. Account-based AI orchestration.' },
  { name: 'Conversica', domain: 'conversica.com', cats: ['AGENTS', 'CHAT'], region: 'NA', blurb: 'Veteran AI sales agents for follow-up + lead qualification.' },
  { name: 'Landbase', domain: 'landbase.com', cats: ['AGENTS'], region: 'NA', blurb: 'Go-to-market agents for RevOps. Continuously qualify + score accounts.' },
  { name: 'Averi', domain: 'averi.ai', cats: ['AGENTS', 'COPY'], region: 'NA', blurb: 'Content ops AI for startups. Research → write → publish autonomous loop.' },
  { name: 'Warmly', domain: 'warmly.ai', cats: ['AGENTS'], region: 'NA', blurb: 'Suite of AI agents across outbound, email, ads for SMBs.' },

  // ==== AI COPYWRITING ====
  { name: 'Copy.ai', domain: 'copy.ai', cats: ['COPY'], region: 'NA', blurb: 'Growth-team focused. Strong automation + GTM stack integration.' },
  { name: 'Writesonic', domain: 'writesonic.com', cats: ['COPY', 'SEO_CONTENT'], region: 'ASIA', blurb: 'Indian-origin. SEO content + ad copy + chatbots in one suite.' },
  { name: 'Anyword', domain: 'anyword.com', cats: ['COPY', 'AD_CREATIVE'], region: 'NA', blurb: 'Predictive Performance Score for every copy variation before media spend.' },
  { name: 'Phrasee', domain: 'phrasee.co', cats: ['COPY', 'EMAIL_LIFECYCLE'], region: 'EU', blurb: 'UK enterprise brand language AI. Used by major retailers for email + push subject lines.' },
  { name: 'Textio', domain: 'textio.com', cats: ['COPY'], region: 'NA', blurb: 'Augmented writing for inclusive, on-brand content at scale.' },

  // ==== AI SEO CONTENT ====
  { name: 'Surfer SEO', domain: 'surferseo.com', cats: ['SEO_CONTENT'], region: 'EU', tier: 'A', blurb: 'Polish leader. Real-time content scoring + SERP analysis + AI writing assistant.' },
  { name: 'Clearscope', domain: 'clearscope.io', cats: ['SEO_CONTENT'], region: 'NA', tier: 'A', blurb: 'Premium A-F content grading via NLP. Used by major brands for editorial-grade output.' },
  { name: 'MarketMuse', domain: 'marketmuse.com', cats: ['SEO_CONTENT'], region: 'NA', blurb: 'Patented AI topic modeling + Personalized Difficulty scoring. Now part of Siteimprove.' },
  { name: 'NeuronWriter', domain: 'neuronwriter.com', cats: ['SEO_CONTENT', 'GEO'], region: 'EU', blurb: 'Polish budget pick. Semantic SEO + GEO at $23/mo entry tier.' },
  { name: 'Rankability', domain: 'rankability.com', cats: ['SEO_CONTENT', 'GEO'], region: 'NA', blurb: 'IBM Watson + Google NLP for hybrid content recommendations + monthly coaching calls.' },
  { name: 'WriterZen', domain: 'writerzen.net', cats: ['SEO_CONTENT'], region: 'ASIA', blurb: 'Vietnamese platform. Keyword clustering + competitive research + AI writing.' },
  { name: 'Outranking', domain: 'outranking.io', cats: ['SEO_CONTENT'], region: 'NA', blurb: 'Structured brief workflow + outline-first content production.' },
  { name: 'Dashword', domain: 'dashword.com', cats: ['SEO_CONTENT'], region: 'NA', blurb: 'Lean content optimization for growing teams.' },
  { name: 'Content Harmony', domain: 'contentharmony.com', cats: ['SEO_CONTENT'], region: 'NA', blurb: 'Streamlined briefs + project management + optimization workflows.' },
  { name: 'PageOptimizer Pro', domain: 'pageoptimizer.pro', cats: ['SEO_CONTENT'], region: 'NA', blurb: 'On-page SEO testing for serious tinkerers.' },
  { name: 'SE Ranking', domain: 'seranking.com', cats: ['SEO_CONTENT'], region: 'EU', blurb: 'All-in-one SEO platform with rank tracking, audits, content tools.' },
  { name: 'Ahrefs', domain: 'ahrefs.com', cats: ['SEO_CONTENT', 'GEO'], region: 'ASIA', tier: 'A', blurb: 'Singapore SEO incumbent. Brand Radar tracks AI search prompts at scale.' },
  { name: 'SEO.ai', domain: 'seo.ai', cats: ['SEO_CONTENT'], region: 'EU', blurb: 'Danish AI SEO platform. End-to-end content generation + optimization.' },
  { name: 'Siteimprove', domain: 'siteimprove.com', cats: ['SEO_CONTENT', 'INCUMBENT'], region: 'EU', blurb: 'Danish enterprise content intelligence. Acquired MarketMuse.' },

  // ==== CONVERSATIONAL / CHAT ====
  { name: 'Intercom', domain: 'intercom.com', cats: ['CHAT', 'INCUMBENT'], region: 'NA', tier: 'A', blurb: 'Fin AI agent + customer messaging. Industry standard for SaaS.' },
  { name: 'Drift (Salesloft)', domain: 'drift.com', cats: ['CHAT'], region: 'NA', tier: 'A', blurb: 'B2B conversational marketing inside Salesloft revenue suite.' },
  { name: 'Tolstoy', domain: 'gotolstoy.com', cats: ['CHAT', 'PERSONALIZATION'], region: 'EU', blurb: 'Israeli. AI Shopper combines chat + shoppable video + Shopify integration.' },
  { name: 'Gorgias', domain: 'gorgias.com', cats: ['CHAT', 'INCUMBENT'], region: 'NA', tier: 'A', blurb: 'Helpdesk + AI Agent built for Shopify brands. Drives sales, not just deflects tickets.' },
  { name: 'Octane AI', domain: 'octaneai.com', cats: ['CHAT', 'PERSONALIZATION'], region: 'NA', blurb: 'Shopify chatbot + quizzes for personalized recommendations.' },
  { name: 'ManyChat', domain: 'manychat.com', cats: ['CHAT', 'WHATSAPP', 'SOCIAL_AI'], region: 'NA', blurb: 'Messenger + Instagram + WhatsApp chatbot at SMB scale.' },
  { name: 'Tidio', domain: 'tidio.com', cats: ['CHAT'], region: 'EU', blurb: 'Polish accessible SMB chatbot with workflow actions.' },
  { name: 'Maisie', domain: 'maisie.ai', cats: ['CHAT'], region: 'ASIA', blurb: 'Australian conversational AI for ecommerce automation.' },
  { name: 'Botpress', domain: 'botpress.com', cats: ['CHAT'], region: 'NA', blurb: 'Developer platform for conversational AI. Custom enterprise process automation.' },
  { name: 'Alhena', domain: 'alhena.ai', cats: ['CHAT', 'PERSONALIZATION'], region: 'NA', blurb: 'Guided selling for complex catalogs. Strong ecom conversion lift.' },
  { name: 'Oscar Chat', domain: 'oscarchat.ai', cats: ['CHAT'], region: 'NA', blurb: 'Intent detection for tailored buying-journey responses.' },
  { name: 'YourGPT', domain: 'yourgpt.ai', cats: ['CHAT'], region: 'NA', blurb: 'Custom GPT-powered assistants trained on store data.' },
  { name: 'Sendbird', domain: 'sendbird.com', cats: ['CHAT', 'INCUMBENT'], region: 'NA', blurb: 'Powers 7B+ conversations/month. delight.ai retail agent built on top.' },
  { name: 'LivePerson', domain: 'liveperson.com', cats: ['CHAT', 'INCUMBENT'], region: 'NA', blurb: 'Conversational cloud incumbent for enterprise customer experience.' },

  // ==== INDIA / ASIA CONVERSATIONAL ====
  { name: 'Yellow.ai', domain: 'yellow.ai', cats: ['CHAT', 'WHATSAPP'], region: 'ASIA', tier: 'A', blurb: 'Indian conversational AI leader. Multilingual + multi-channel automation. $102M raised.' },
  { name: 'Haptik', domain: 'haptik.ai', cats: ['CHAT', 'WHATSAPP'], region: 'ASIA', blurb: 'Indian. Industry-specific NLU models for product discovery + support.' },
  { name: 'Gupshup', domain: 'gupshup.io', cats: ['CHAT', 'WHATSAPP'], region: 'ASIA', tier: 'A', blurb: 'Conversational AI for marketing + commerce + support. 130+ countries, 120B msgs/year.' },

  // ==== VOICE AI ====
  { name: 'Parloa', domain: 'parloa.com', cats: ['VOICE', 'AGENTS', 'CHAT'], region: 'EU', tier: 'A', blurb: 'German agentic voice + text agents. $560M+ raised. 150+ enterprise customers.' },
  { name: 'Numa', domain: 'numa.com', cats: ['VOICE'], region: 'NA', vertical: 'Auto', blurb: 'Voice AI for auto dealerships. $32M Series B. Vertical-specific.' },
  { name: 'Maki', domain: 'makihq.com', cats: ['VOICE', 'AGENTS'], region: 'EU', vertical: 'HR', blurb: 'French AI voice agents for HR interviews. $28.6M raised.' },

  // ==== EMAIL / MARTECH INCUMBENTS ====
  { name: 'HubSpot', domain: 'hubspot.com', cats: ['INCUMBENT', 'EMAIL_LIFECYCLE'], region: 'NA', tier: 'A', blurb: 'CRM + marketing platform. AI-driven segmentation cited 54% MQL lift in case studies.' },
  { name: 'Salesforce Marketing Cloud', domain: 'salesforce.com', cats: ['INCUMBENT', 'EMAIL_LIFECYCLE'], region: 'NA', tier: 'A', blurb: 'Enterprise martech. Marketing Cloud Next + Einstein GPT + Data Cloud.' },
  { name: 'Adobe (Marketo)', domain: 'adobe.com', cats: ['INCUMBENT', 'EMAIL_LIFECYCLE', 'CREATIVE_OPS'], region: 'NA', tier: 'A', blurb: 'Marketo for B2B + Sensei AI + Firefly for creative. Agent Orchestrator coming.' },
  { name: 'ActiveCampaign', domain: 'activecampaign.com', cats: ['EMAIL_LIFECYCLE', 'INCUMBENT'], region: 'NA', blurb: 'SMB-mid market marketing automation with AI assist.' },
  { name: 'Klaviyo', domain: 'klaviyo.com', cats: ['EMAIL_LIFECYCLE', 'INCUMBENT'], region: 'NA', tier: 'A', blurb: 'Ecommerce email + SMS leader. AI predictions + subject line optimization.' },
  { name: 'Attentive', domain: 'attentive.com', cats: ['EMAIL_LIFECYCLE', 'INCUMBENT'], region: 'NA', blurb: 'SMS marketing AI. Personalized journeys for ecom.' },
  { name: 'Mailchimp (Intuit)', domain: 'mailchimp.com', cats: ['EMAIL_LIFECYCLE', 'INCUMBENT'], region: 'NA', blurb: 'SMB email + AI automations. Owned by Intuit.' },
  { name: 'Sprinklr', domain: 'sprinklr.com', cats: ['INCUMBENT', 'SOCIAL_AI'], region: 'NA', blurb: 'Unified customer experience platform with AI across social, ads, support.' },
  { name: 'Hootsuite', domain: 'hootsuite.com', cats: ['SOCIAL_AI', 'INCUMBENT'], region: 'NA', blurb: 'Canadian social media management with AI assistant features.' },
  { name: 'Bloomreach', domain: 'bloomreach.com', cats: ['PERSONALIZATION', 'INCUMBENT'], region: 'EU', blurb: 'Personalization + ecommerce search. Loomi AI across journey.' },
  { name: 'Dynamic Yield', domain: 'dynamicyield.com', cats: ['PERSONALIZATION'], region: 'NA', blurb: 'Personalization platform owned by Mastercard. AI recommendations.' },
  { name: 'Klevu', domain: 'klevu.com', cats: ['PERSONALIZATION'], region: 'EU', blurb: 'UK AI search/discovery for ecommerce.' },
  { name: 'Zeta Global', domain: 'zetaglobal.com', cats: ['INCUMBENT', 'EMAIL_LIFECYCLE'], region: 'NA', blurb: 'Public marketing data + AI cloud. Identity-resolved profiles at scale.' },
  { name: 'Stensul', domain: 'stensul.com', cats: ['CREATIVE_OPS', 'EMAIL_LIFECYCLE'], region: 'NA', blurb: 'Email creation platform enforcing brand + design guidelines.' },

  // ==== WORKFLOW AUTOMATION ====
  { name: 'n8n', domain: 'n8n.io', cats: ['WORKFLOW'], region: 'EU', tier: 'A', blurb: 'German visual canvas + self-hosted. Massive growth among technical AI workflow builders.' },
  { name: 'Zapier', domain: 'zapier.com', cats: ['WORKFLOW', 'INCUMBENT'], region: 'NA', tier: 'A', blurb: 'Workflow automation incumbent. AI Actions + agent capabilities expanding.' },
  { name: 'Make', domain: 'make.com', cats: ['WORKFLOW'], region: 'EU', blurb: 'Czech visual scenario builder. Sophisticated branching + AI integration.' },
  { name: 'Gumloop', domain: 'gumloop.com', cats: ['WORKFLOW', 'AGENTS'], region: 'NA', blurb: 'No-code AI workflow builder with Gummie agent for natural-language assembly.' },
  { name: 'Relay.app', domain: 'relay.app', cats: ['WORKFLOW', 'AGENTS'], region: 'NA', blurb: 'AI-powered automation with human-in-the-loop. Approachable for beginners.' },

  // ==== AGENCIES (FULL-SERVICE AI) ====
  { name: 'Thrive', domain: 'thriveagency.com', cats: ['AGENCY', 'GEO'], region: 'NA', blurb: 'Premier Google + Shopify partner. Boutique feel with global scale + GEO mastery.' },
  { name: 'Directive', domain: 'directiveconsulting.com', cats: ['AGENCY', 'GEO'], region: 'NA', blurb: 'B2B SaaS GEO + paid + content with AI ops underpinning every retainer.' },
  { name: 'Graphite', domain: 'graphite.io', cats: ['AGENCY', 'SEO_CONTENT'], region: 'NA', blurb: 'Programmatic SEO + AEO for high-growth SaaS. Own platform under the hood.' },
  { name: 'NP Digital', domain: 'npdigital.com', cats: ['AGENCY'], region: 'NA', blurb: 'Neil Patel\'s global agency. Heavy AI tooling integration.' },
  { name: 'Vendasta', domain: 'vendasta.com', cats: ['AGENCY'], region: 'NA', blurb: 'White-label AI marketing services for resellers + small agencies.' },
  { name: 'GrowthSpree', domain: 'growthspreeofficial.com', cats: ['AGENCY'], region: 'NA', blurb: 'Top AI-powered B2B SaaS agency 2026. Flat-fee SaaS marketing model.' },
  { name: 'SmartBug Media', domain: 'smartbugmedia.com', cats: ['AGENCY'], region: 'NA', blurb: 'HubSpot Elite Partner. AI-enhanced inbound + lifecycle automation.' },

  // ==== PERSONALIZATION & ON-SITE ====
  { name: 'Mutiny', domain: 'mutinyhq.com', cats: ['PERSONALIZATION'], region: 'NA', blurb: 'B2B website personalization with AI playbooks for ABM.' },

  // ==== AGENTIC COMMERCE / SHOPPING AGENTS ====
  { name: 'Perplexity', domain: 'perplexity.ai', cats: ['AGENTIC_COMMERCE'], region: 'NA', tier: 'A', blurb: 'Answer engine with shopping. Where buyers increasingly start product research.' },
  { name: 'OpenAI / ChatGPT Search', domain: 'openai.com', cats: ['AGENTIC_COMMERCE', 'AGENTS'], region: 'NA', tier: 'A', blurb: 'ChatGPT Search + Operator agent. Shoppable instant checkout via partners.' },
  { name: 'Shopify Shop AI', domain: 'shopify.com', cats: ['AGENTIC_COMMERCE', 'INCUMBENT'], region: 'NA', tier: 'A', blurb: 'Agentic Storefronts selling inside ChatGPT (Winter \'26 release).' },
  { name: 'Google AI Mode', domain: 'google.com', cats: ['AGENTIC_COMMERCE'], region: 'NA', tier: 'A', blurb: 'AI Overviews + AI Mode reshape Google Shopping discovery.' },

  // ==== LATAM ====
  { name: 'Patagon AI', domain: 'patagon.ai', cats: ['AGENTS'], region: 'LATAM', tier: 'A', blurb: 'Argentina/Ecuador. AI agents for sales + marketing automation. 400% conversion lifts. Operates in 5 countries.' },
  { name: 'Boom AI', domain: 'boomai.com', cats: ['AGENTS', 'PERSONALIZATION'], region: 'LATAM', blurb: 'Mexican AI growth team for ecom. YC F25, only Mexican company in batch.' },
  { name: 'Loopia', domain: 'loopia.ai', cats: ['CHAT'], region: 'LATAM', blurb: 'Brazilian. Centralizes ecom customer service with Luna AI agent.' },
  { name: 'Morada.ai', domain: 'morada.ai', cats: ['CHAT'], region: 'LATAM', vertical: 'Real Estate', blurb: 'Brazilian proptech. Mia chatbot for listings + viewings + broker connection.' },
  { name: 'Blip', domain: 'blip.ai', cats: ['CHAT', 'WHATSAPP'], region: 'LATAM', tier: 'A', blurb: 'Brazilian conversational marketing. $100M+ ARR. Backed by SoftBank + Microsoft. 300K+ chatbots.' },
  { name: 'Revi', domain: 'revi.ai', cats: ['WHATSAPP'], region: 'LATAM', blurb: 'Brazilian WhatsApp marketing AI. Conversations → conversions specialist.' },
  { name: 'Leadsales', domain: 'leadsales.io', cats: ['WHATSAPP', 'CHAT'], region: 'LATAM', blurb: 'Mexican WhatsApp CRM. Forbes Mexico 30 Under 30 founder. Expanding to Brazil + Africa + SEA.' },
  { name: 'Darwin AI', domain: 'darwin-ai.com', cats: ['AGENTS', 'CHAT'], region: 'LATAM', blurb: 'Argentine AI agents trained for sales, support, lead qualification.' },
  { name: 'AI Turing', domain: 'aituring.com', cats: ['PROGRAMMATIC'], region: 'LATAM', blurb: 'Latin commercial AI for PPC companies. Tracks sales force at scale.' },
  { name: 'AndesML', domain: 'andesml.com', cats: ['PROGRAMMATIC'], region: 'LATAM', blurb: 'Enables ecommerce platforms to launch + monetize their own ad networks.' },
  { name: 'Vexus Agency', domain: 'vexusagency.com', cats: ['AGENCY'], region: 'LATAM', blurb: 'Mexican agency specializing in AI-powered digital marketing for local brands.' },

  // ==== EUROPE ====
  { name: 'Mistral AI', domain: 'mistral.ai', cats: ['INCUMBENT', 'AGENTS'], region: 'EU', tier: 'A', blurb: 'Paris. European frontier lab. $2B raised. Open-weight models powering EU enterprise AI.' },
  { name: 'Lovable', domain: 'lovable.dev', cats: ['WORKFLOW'], region: 'EU', blurb: 'Stockholm. AI app builder. Marketers prototype landing pages + tools.' },
  { name: 'Black Forest Labs', domain: 'bfl.ai', cats: ['CREATIVE_OPS', 'VIDEO_GEN'], region: 'EU', blurb: 'Berlin. FLUX family of generative image/editing models powering many ad creative tools.' },
  { name: 'Dust', domain: 'dust.tt', cats: ['AGENTS'], region: 'EU', blurb: 'Paris. Custom assistants with company context + permission granularity.' },
  { name: 'Mirakl', domain: 'mirakl.com', cats: ['INCUMBENT'], region: 'EU', blurb: 'French marketplace + retail media + dropship enabler.' },

  // ==== ASIA ====
  { name: 'ByteDance', domain: 'bytedance.com', cats: ['VIDEO_GEN', 'PROGRAMMATIC', 'INCUMBENT'], region: 'ASIA', tier: 'A', blurb: 'Chinese parent of TikTok. Seedance video gen + massive ad platform Pangle.' },
  { name: 'Baidu', domain: 'baidu.com', cats: ['INCUMBENT', 'GEO'], region: 'ASIA', tier: 'A', blurb: 'Chinese search + ads + Ernie LLM. Dominant generative AI player in China.' },
  { name: 'Alibaba', domain: 'alibaba.com', cats: ['INCUMBENT', 'PROGRAMMATIC'], region: 'ASIA', tier: 'A', blurb: 'Chinese ecommerce ads + Qwen LLM + cloud. Critical for China market entry.' },
  { name: 'Tencent', domain: 'tencent.com', cats: ['INCUMBENT', 'SOCIAL_AI'], region: 'ASIA', blurb: 'Chinese WeChat ads + Hunyuan LLM. Owns chat + social discovery in China.' },
  { name: 'Pixis AI', domain: 'pixis.ai', cats: ['AD_CREATIVE', 'PROGRAMMATIC'], region: 'ASIA', tier: 'A', blurb: 'Indian performance marketing AI. Codeless infrastructure for digital ads + creative + ROI.' },
  { name: 'Blend AI', domain: 'blendcommerce.com', cats: ['AD_CREATIVE'], region: 'ASIA', blurb: 'Indian AI-driven ad management for ecommerce brands.' },
  { name: 'Airbots.ai', domain: 'airbots.ai', cats: ['AGENTS', 'AD_CREATIVE'], region: 'ASIA', blurb: 'Indian autonomous marketing platform optimizing ads across digital media.' },

  // ==== RUSSIA / CIS ====
  { name: 'Yandex', domain: 'yandex.com', cats: ['INCUMBENT', 'GEO'], region: 'CIS', tier: 'A', blurb: 'Russian search + ads + YandexGPT + Yandex Cloud. Sovereign AI suite launched 2026.' },
  { name: 'Sber AI', domain: 'sber.ai', cats: ['INCUMBENT', 'CREATIVE_OPS'], region: 'CIS', tier: 'A', blurb: 'Russian banking giant\'s AI: GigaChat LLM + Kandinsky 5.0 (image/video). Open-source available.' },
  { name: 'MTS AI', domain: 'mts.ai', cats: ['INCUMBENT', 'VOICE'], region: 'CIS', blurb: 'Russian telecom\'s AI division. Voice AI + analytics + custom models.' },
  { name: 'VK', domain: 'vk.com', cats: ['INCUMBENT', 'SOCIAL_AI'], region: 'CIS', blurb: 'Russian social platform + ads + VK Cloud AI services.' },
  { name: 'Toloka', domain: 'toloka.ai', cats: ['WORKFLOW'], region: 'CIS', blurb: 'AI training data + agent safety / red-teaming. Customers include leading AI labs.' },
  { name: 'Nebius', domain: 'nebius.com', cats: ['INCUMBENT'], region: 'CIS', blurb: 'AI cloud infra. NVIDIA Blackwell deployments. Targeting $1B+ ARR.' }
];

// Build derived tag list
const ALL_CATS = Object.keys(CATEGORIES);
const ALL_REGIONS = Object.keys(REGIONS);

// ============================================================
// LOGO COMPONENT — Clearbit primary, Google favicon fallback
// ============================================================
function Logo({ domain, name }) {
  const [src, setSrc] = useState(`https://logo.clearbit.com/${domain}`);
  const [errored, setErrored] = useState(false);

  const handleError = () => {
    if (!errored) {
      setSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
      setErrored(true);
    } else {
      setSrc(null);
    }
  };

  if (!src) {
    const initial = (name || '?').charAt(0).toUpperCase();
    return (
      <div className="w-10 h-10 rounded-md flex items-center justify-center font-mono text-sm bg-zinc-800 text-lime-400 border border-zinc-700">
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={handleError}
      className="w-10 h-10 rounded-md object-contain bg-white/5 p-1 border border-zinc-800"
    />
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function AIMarketingLandscape() {
  const [search, setSearch] = useState('');
  const [activeCats, setActiveCats] = useState([]);
  const [activeRegions, setActiveRegions] = useState([]);
  const [selected, setSelected] = useState(null);

  // Inject Google Fonts once
  useEffect(() => {
    const id = 'aimkt-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(link);
  }, []);

  const toggle = (val, list, setList) => {
    setList(list.includes(val) ? list.filter(v => v !== val) : [...list, val]);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return COMPANIES.filter(c => {
      if (q && !(`${c.name} ${c.blurb} ${c.domain}`.toLowerCase().includes(q))) return false;
      if (activeCats.length && !c.cats.some(cat => activeCats.includes(cat))) return false;
      if (activeRegions.length && !activeRegions.includes(c.region)) return false;
      return true;
    });
  }, [search, activeCats, activeRegions]);

  // Sort: tier A first, then alphabetical
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (a.tier === 'A' && b.tier !== 'A') return -1;
      if (a.tier !== 'A' && b.tier === 'A') return 1;
      return a.name.localeCompare(b.name);
    });
  }, [filtered]);

  const stats = useMemo(() => {
    const byCat = {};
    ALL_CATS.forEach(c => { byCat[c] = 0; });
    const byRegion = {};
    ALL_REGIONS.forEach(r => { byRegion[r] = 0; });
    COMPANIES.forEach(c => {
      c.cats.forEach(cat => { byCat[cat] = (byCat[cat] || 0) + 1; });
      byRegion[c.region] = (byRegion[c.region] || 0) + 1;
    });
    return { byCat, byRegion, total: COMPANIES.length };
  }, []);

  const fontStyle = { fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' };
  const serifStyle = { fontFamily: '"Instrument Serif", Georgia, serif' };
  const monoStyle = { fontFamily: '"JetBrains Mono", monospace' };

  const clearAll = () => { setActiveCats([]); setActiveRegions([]); setSearch(''); };
  const hasFilters = activeCats.length || activeRegions.length || search;

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-200" style={fontStyle}>
      {/* Subtle grid background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025]" style={{
        backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
        backgroundSize: '64px 64px'
      }} />
      {/* Glow */}
      <div className="fixed top-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none" style={{
        background: 'radial-gradient(circle, rgba(192,255,0,0.08) 0%, transparent 70%)'
      }} />

      <div className="relative">
        {/* HEADER */}
        <header className="border-b border-zinc-900 px-6 md:px-12 py-8 md:py-14">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center gap-2 mb-6" style={monoStyle}>
              <span className="text-lime-400 text-xs">●</span>
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">DOSSIER /// COMPETITIVE LANDSCAPE</span>
              <span className="text-xs text-zinc-700">/</span>
              <span className="text-xs text-zinc-500">2026.05</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-6 max-w-5xl" style={serifStyle}>
              The AI Marketing<br/>
              <em className="text-lime-400">force-multiplier</em><br/>
              <span className="text-zinc-500">map.</span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-10">
              Every category of company building AI tools that replace what traditional marketers and advertisers used to do — pre-2026. Filter, hover, click any logo to visit. The whole field at a glance.
            </p>

            {/* STATS BAR */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-900 rounded-lg overflow-hidden border border-zinc-900">
              <div className="bg-[#0a0a0b] p-5">
                <div className="text-3xl md:text-4xl text-lime-400" style={serifStyle}>{stats.total}</div>
                <div className="text-xs uppercase tracking-wider text-zinc-500 mt-1" style={monoStyle}>companies tracked</div>
              </div>
              <div className="bg-[#0a0a0b] p-5">
                <div className="text-3xl md:text-4xl text-zinc-200" style={serifStyle}>{ALL_CATS.length}</div>
                <div className="text-xs uppercase tracking-wider text-zinc-500 mt-1" style={monoStyle}>categories mapped</div>
              </div>
              <div className="bg-[#0a0a0b] p-5">
                <div className="text-3xl md:text-4xl text-zinc-200" style={serifStyle}>{ALL_REGIONS.length}</div>
                <div className="text-xs uppercase tracking-wider text-zinc-500 mt-1" style={monoStyle}>regions covered</div>
              </div>
              <div className="bg-[#0a0a0b] p-5">
                <div className="text-3xl md:text-4xl text-zinc-200" style={serifStyle}>
                  <em className="text-lime-400">live</em>
                </div>
                <div className="text-xs uppercase tracking-wider text-zinc-500 mt-1" style={monoStyle}>updated may 2026</div>
              </div>
            </div>

            {/* THESIS NOTE */}
            <div className="mt-8 p-5 border border-lime-400/20 bg-lime-400/[0.02] rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-lime-400 mt-1 flex-shrink-0" />
                <p className="text-sm text-zinc-400 leading-relaxed">
                  <span className="text-lime-400" style={monoStyle}>// THESIS:</span> Discovery is shifting from human-driven search to LLM- and agent-mediated answers. Categories tagged <span className="text-lime-400">CRITICAL</span> in the filter below are the ones moving fastest right now: <strong className="text-zinc-200">Generative Engine Optimization</strong>, <strong className="text-zinc-200">Autonomous Marketing Agents</strong>, and <strong className="text-zinc-200">Agentic Commerce</strong>.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* CONTROLS */}
        <section className="sticky top-0 z-30 border-b border-zinc-900 backdrop-blur-xl bg-[#0a0a0b]/80 px-6 md:px-12 py-4">
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search */}
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search companies, descriptions..."
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-md text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-lime-400/50 focus:bg-zinc-900"
                style={fontStyle}
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap text-xs" style={monoStyle}>
              <span className="text-zinc-600 uppercase tracking-wider">
                {sorted.length}<span className="text-zinc-700">/{stats.total}</span> showing
              </span>
              {hasFilters && (
                <button onClick={clearAll} className="flex items-center gap-1 px-2.5 py-1 text-zinc-500 hover:text-lime-400 border border-zinc-800 rounded hover:border-lime-400/30 transition-colors uppercase">
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* FILTER PANELS */}
        <section className="border-b border-zinc-900 px-6 md:px-12 py-6">
          <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Category filters */}
            <div>
              <div className="flex items-center gap-2 mb-3" style={monoStyle}>
                <Layers className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-xs uppercase tracking-[0.15em] text-zinc-500">filter by category</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_CATS.map(cat => {
                  const meta = CATEGORIES[cat];
                  const active = activeCats.includes(cat);
                  const isCritical = meta.tone === 'critical';
                  return (
                    <button
                      key={cat}
                      onClick={() => toggle(cat, activeCats, setActiveCats)}
                      className={`px-3 py-1.5 text-xs rounded-md border transition-all flex items-center gap-1.5 ${
                        active
                          ? 'bg-lime-400 text-black border-lime-400 font-semibold'
                          : isCritical
                            ? 'bg-lime-400/[0.05] text-lime-400 border-lime-400/30 hover:bg-lime-400/10'
                            : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                      style={monoStyle}
                    >
                      {meta.short}
                      <span className={active ? 'text-black/60' : 'text-zinc-600'}>
                        {stats.byCat[cat] || 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Region filters */}
            <div>
              <div className="flex items-center gap-2 mb-3" style={monoStyle}>
                <Globe className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-xs uppercase tracking-[0.15em] text-zinc-500">filter by region</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_REGIONS.map(r => {
                  const meta = REGIONS[r];
                  const active = activeRegions.includes(r);
                  return (
                    <button
                      key={r}
                      onClick={() => toggle(r, activeRegions, setActiveRegions)}
                      className={`px-3 py-1.5 text-xs rounded-md border transition-all flex items-center gap-2 ${
                        active
                          ? 'bg-lime-400 text-black border-lime-400 font-semibold'
                          : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                      style={monoStyle}
                    >
                      <span className="text-base leading-none">{meta.flag}</span>
                      {meta.name}
                      <span className={active ? 'text-black/60' : 'text-zinc-600'}>
                        {stats.byRegion[r] || 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* GRID */}
        <main className="px-6 md:px-12 py-8">
          <div className="max-w-[1400px] mx-auto">
            {sorted.length === 0 && (
              <div className="text-center py-20">
                <div className="text-lg text-zinc-500 mb-2" style={serifStyle}>No companies match these filters.</div>
                <button onClick={clearAll} className="text-lime-400 text-sm hover:underline" style={monoStyle}>
                  ← reset filters
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-zinc-900 border border-zinc-900 rounded-lg overflow-hidden">
              {sorted.map(co => (
                <CompanyCard key={co.name} co={co} onClick={() => setSelected(co)} />
              ))}
            </div>
          </div>
        </main>

        {/* CATEGORY BREAKDOWN */}
        <section className="border-t border-zinc-900 px-6 md:px-12 py-12 mt-8">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="text-3xl md:text-4xl mb-8" style={serifStyle}>
              <em className="text-lime-400">Where</em> the field is concentrated
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {ALL_CATS
                .map(cat => ({ cat, count: stats.byCat[cat] || 0 }))
                .sort((a, b) => b.count - a.count)
                .map(({ cat, count }) => {
                  const meta = CATEGORIES[cat];
                  const max = Math.max(...Object.values(stats.byCat));
                  const pct = (count / max) * 100;
                  const active = activeCats.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggle(cat, activeCats, setActiveCats)}
                      className={`text-left p-4 border rounded-lg transition-all ${active ? 'border-lime-400 bg-lime-400/5' : 'border-zinc-900 hover:border-zinc-800 bg-[#0c0c0d]'}`}
                    >
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-xs uppercase tracking-wider text-zinc-500" style={monoStyle}>{meta.short}</span>
                        <span className={`text-xl ${active ? 'text-lime-400' : 'text-zinc-300'}`} style={serifStyle}>{count}</span>
                      </div>
                      <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${active ? 'bg-lime-400' : 'bg-zinc-600'} transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-zinc-900 px-6 md:px-12 py-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row gap-8 justify-between">
              <div className="max-w-2xl">
                <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2" style={monoStyle}>methodology</div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Sourced from 2026 industry reports, agency rankings, accelerator portfolios (YC, Google for Startups, Qualcomm AIPI), VC databases (Crunchbase, PitchBook, Cuántico VP), product comparisons, and direct company sites. Categories overlap intentionally — many platforms span multiple. Tier A pins indicate category leaders by funding, traction, and analyst rankings.
                </p>
              </div>
              <div className="text-xs space-y-2 text-zinc-500" style={monoStyle}>
                <div>BUILT FOR FAST EXPLORATION</div>
                <div>NEXT ARTIFACT: positioning gaps + go-to-market plays.</div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* DETAIL MODAL */}
      {selected && <DetailModal co={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ============================================================
// COMPANY CARD
// ============================================================
function CompanyCard({ co, onClick }) {
  const monoStyle = { fontFamily: '"JetBrains Mono", monospace' };
  const serifStyle = { fontFamily: '"Instrument Serif", Georgia, serif' };
  const isPinned = co.tier === 'A';

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-[#0c0c0d] hover:bg-zinc-900/50 transition-all p-5 relative"
    >
      {isPinned && (
        <div className="absolute top-3 right-3 text-[10px] text-lime-400 border border-lime-400/30 px-1.5 py-0.5 rounded" style={monoStyle}>
          PINNED
        </div>
      )}
      <div className="flex items-start gap-3 mb-3">
        <Logo domain={co.domain} name={co.name} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-lg font-semibold text-zinc-100 truncate" style={serifStyle}>
              {co.name}
            </h3>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-lime-400 transition-colors flex-shrink-0" />
          </div>
          <div className="text-xs text-zinc-600 truncate" style={monoStyle}>{co.domain}</div>
        </div>
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 mb-3">
        {co.blurb}
      </p>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/50 text-zinc-400 border border-zinc-800" style={monoStyle}>
          {REGIONS[co.region]?.flag} {co.region}
        </span>
        {co.cats.slice(0, 2).map(cat => (
          <span key={cat} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/50 text-zinc-500 border border-zinc-800" style={monoStyle}>
            {CATEGORIES[cat]?.short}
          </span>
        ))}
        {co.cats.length > 2 && (
          <span className="text-[10px] text-zinc-600" style={monoStyle}>+{co.cats.length - 2}</span>
        )}
        {co.vertical && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-lime-400/10 text-lime-400 border border-lime-400/20" style={monoStyle}>
            {co.vertical}
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================================
// DETAIL MODAL
// ============================================================
function DetailModal({ co, onClose }) {
  const monoStyle = { fontFamily: '"JetBrains Mono", monospace' };
  const serifStyle = { fontFamily: '"Instrument Serif", Georgia, serif' };
  const fontStyle = { fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' };

  useEffect(() => {
    const handle = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handle);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handle);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      style={fontStyle}
    >
      <div
        className="bg-[#0c0c0d] border border-zinc-800 rounded-xl max-w-lg w-full p-8 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4 mb-6">
          <Logo domain={co.domain} name={co.name} />
          <div className="flex-1">
            <h2 className="text-3xl mb-1" style={serifStyle}>{co.name}</h2>
            <a
              href={`https://${co.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-lime-400 hover:underline inline-flex items-center gap-1"
              style={monoStyle}
            >
              {co.domain} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <p className="text-zinc-300 leading-relaxed mb-6">{co.blurb}</p>

        <div className="space-y-4 mb-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2" style={monoStyle}>Region</div>
            <div className="text-sm text-zinc-300">
              {REGIONS[co.region]?.flag} {REGIONS[co.region]?.name}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2" style={monoStyle}>Categories</div>
            <div className="flex flex-wrap gap-1.5">
              {co.cats.map(cat => (
                <span key={cat} className="text-xs px-2 py-1 rounded bg-zinc-900 text-zinc-300 border border-zinc-800" style={monoStyle}>
                  {CATEGORIES[cat]?.name}
                </span>
              ))}
            </div>
          </div>

          {co.vertical && (
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2" style={monoStyle}>Vertical</div>
              <span className="text-xs px-2 py-1 rounded bg-lime-400/10 text-lime-400 border border-lime-400/20" style={monoStyle}>
                {co.vertical}
              </span>
            </div>
          )}
        </div>

        <a
          href={`https://${co.domain}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-lime-400 text-black rounded-md font-semibold text-sm hover:bg-lime-300 transition-colors"
        >
          Visit website <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
