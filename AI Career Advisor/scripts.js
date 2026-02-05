// تفعيل جميع أزرار وروابط الموقع للتنقل بين الصفحات

function notify(msg, type = 'info', timeout = 3000) {
  var notifyDiv = document.getElementById('notify');
  if (!notifyDiv) return;
  var color = type === 'success' ? '#4f8cff' : type === 'error' ? '#e74c3c' : '#7c3aed';
  notifyDiv.innerHTML = `<div style="background:${color};color:#fff;padding:1rem 1.5rem;border-radius:1rem;box-shadow:0 2px 12px #0002;font-weight:700;text-align:center;">${msg}</div>`;
  notifyDiv.style.display = 'block';
  setTimeout(function(){ notifyDiv.style.display = 'none'; }, timeout);
}

// مؤثر تحميل عند التنقل
var loaderDiv = document.createElement('div');
loaderDiv.id = 'loader';
loaderDiv.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التحميل...';
loaderDiv.style.display = 'none';
document.body.appendChild(loaderDiv);

function showLoader() {
  loaderDiv.style.display = 'flex';
}
function hideLoader() {
  loaderDiv.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {
  hideLoader();
  // إظهار مؤثر التحميل عند التنقل بين الصفحات
  document.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', function(e){
      if (link.getAttribute('href') && !link.getAttribute('href').startsWith('#')) {
        showLoader();
      }
    });
  });
  // نافذة الدردشة الاستشارية (جلسة حقيقية)
  var openChatBtn = document.getElementById('openChat');
  var chatWidget = document.getElementById('chatWidget');
  var closeChatBtn = document.getElementById('closeChat');
  var chatForm = document.getElementById('chatForm');
  var chatInput = document.getElementById('chatInput');
  var chatMessages = document.getElementById('chatMessages');
  // معلومات المستخدم (من صفحة السيرة الذاتية أو التسجيل)
  var userName = localStorage.getItem('userName') || '';
  var userEmail = localStorage.getItem('userEmail') || '';
  // حفظ بيانات المستخدم عند التسجيل أو إنشاء السيرة الذاتية
  var regForm = document.querySelector('form');
  if (regForm && window.location.pathname.includes('register')) {
    regForm.addEventListener('submit', function(e){
      var nameInput = regForm.querySelector('input[type="text"]');
      var emailInput = regForm.querySelector('input[type="email"]');
      if (nameInput && emailInput) {
        localStorage.setItem('userName', nameInput.value);
        localStorage.setItem('userEmail', emailInput.value);
      }
    });
  }
  var cvForm = document.querySelector('form');
  if (cvForm && window.location.pathname.includes('cv-builder')) {
    cvForm.addEventListener('submit', function(e){
      var nameInput = cvForm.querySelector('input[type="text"]:nth-of-type(1)');
      var emailInput = cvForm.querySelector('input[type="email"]');
      if (nameInput && emailInput) {
        localStorage.setItem('userName', nameInput.value);
        localStorage.setItem('userEmail', emailInput.value);
      }
    });
  }
  // فتح الدردشة وعرض معلومات المستخدم وسجل الجلسة
  if (openChatBtn && chatWidget) {
    openChatBtn.addEventListener('click', function(){
      chatWidget.style.display = 'block';
      openChatBtn.style.display = 'none';
      // عرض معلومات المستخدم
      if (userName || userEmail) {
        var infoDiv = document.createElement('div');
        infoDiv.style.background = '#f8f9fa';
        infoDiv.style.padding = '0.5rem 1rem';
        infoDiv.style.fontSize = '0.9rem';
        infoDiv.style.borderBottom = '1px solid #eee';
        infoDiv.innerHTML = `<b>المستخدم:</b> ${userName} <br><b>البريد:</b> ${userEmail}`;
        if (!chatMessages.querySelector('.user-info')) {
          infoDiv.className = 'user-info';
          chatMessages.prepend(infoDiv);
        }
      }
      // عرض سجل الجلسة
      var chatLog = JSON.parse(localStorage.getItem('chatLog') || '[]');
      chatMessages.innerHTML = '';
      if (userName || userEmail) {
        var infoDiv = document.createElement('div');
        infoDiv.style.background = '#f8f9fa';
        infoDiv.style.padding = '0.5rem 1rem';
        infoDiv.style.fontSize = '0.9rem';
        infoDiv.style.borderBottom = '1px solid #eee';
        infoDiv.innerHTML = `<b>المستخدم:</b> ${userName} <br><b>البريد:</b> ${userEmail}`;
        infoDiv.className = 'user-info';
        chatMessages.appendChild(infoDiv);
      }
      chatLog.forEach(function(item){
        var msgDiv = document.createElement('div');
        msgDiv.style.textAlign = item.sender === 'user' ? 'right' : 'left';
        msgDiv.innerHTML = `<span style="background:${item.sender==='user'?'#e9e6fd':'#4f8cff'};color:${item.sender==='user'?'#222':'#fff'};padding:0.4rem 0.8rem;border-radius:1rem;display:inline-block;margin-bottom:4px;">${item.text}</span>`;
        chatMessages.appendChild(msgDiv);
      });
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  }
  if (closeChatBtn && chatWidget && openChatBtn) {
    closeChatBtn.addEventListener('click', function(){
      chatWidget.style.display = 'none';
      openChatBtn.style.display = 'block';
    });
  }
  if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener('submit', function(e){
      e.preventDefault();
      var msg = chatInput.value.trim();
      if (!msg) return;
      // حفظ الرسالة في LocalStorage
      var chatLog = JSON.parse(localStorage.getItem('chatLog') || '[]');
      chatLog.push({sender:'user',text:msg});
      localStorage.setItem('chatLog', JSON.stringify(chatLog));
      var userMsg = document.createElement('div');
      userMsg.style.textAlign = 'right';
      userMsg.innerHTML = '<span style="background:#e9e6fd;padding:0.4rem 0.8rem;border-radius:1rem;display:inline-block;margin-bottom:4px;">' + msg + '</span>';
      chatMessages.appendChild(userMsg);
      chatInput.value = '';
      setTimeout(function(){
        var botText = '';
        // ردود ذكية حسب الكلمات المفتاحية
        if (/تخصص|مجال|وظيفة|مستقبل/.test(msg)) {
          botText = 'أنصحك باختيار تخصص يناسب ميولك مثل علوم الحاسب أو الهندسة أو التصميم. يمكنك تجربة اختبار الميول المهنية لمعرفة الأنسب لك.';
        } else if (/نصيحة|كيف|أفضل/.test(msg)) {
          botText = 'ابحث عن شغفك وطور مهاراتك باستمرار، وشارك في الدورات والمشاريع العملية. لا تتردد في استشارة الخبراء.';
        } else if (/سيرة|CV|سيفي/.test(msg)) {
          botText = 'يمكنك إنشاء سيرة ذاتية احترافية من خلال صفحة مولد السيرة الذاتية في الموقع، وستحصل على ملف PDF جاهز.';
        } else if (/دورة|تعلم|كورسات/.test(msg)) {
          botText = 'تجد في صفحة خطة التعلم كورسات مقترحة وروابط مباشرة لأفضل المصادر التعليمية.';
        } else if (/شكرا|شكر/.test(msg)) {
          botText = 'العفو! نحن هنا لمساعدتك دائماً.';
        } else {
          botText = 'شكرًا لسؤالك! سيتم الرد عليك قريبًا.';
        }
        chatLog.push({sender:'bot',text:botText});
        localStorage.setItem('chatLog', JSON.stringify(chatLog));
        var botMsg = document.createElement('div');
        botMsg.style.textAlign = 'left';
        botMsg.innerHTML = '<span style="background:#4f8cff;color:#fff;padding:0.4rem 0.8rem;border-radius:1rem;display:inline-block;margin-bottom:4px;">' + botText + '</span>';
        chatMessages.appendChild(botMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 700);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  }
  // زر الوضع الليلي
  var darkBtn = document.getElementById('toggleDark');
  if (darkBtn) {
    darkBtn.addEventListener('click', function() {
      document.documentElement.classList.toggle('dark-mode');
      // حفظ الوضع في التخزين المحلي
      if(document.documentElement.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        darkBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        darkBtn.title = 'وضع نهاري';
      } else {
        localStorage.setItem('theme', 'light');
        darkBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        darkBtn.title = 'وضع ليلي';
      }
    });
    // تفعيل الوضع المحفوظ
    if(localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark-mode');
      darkBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      darkBtn.title = 'وضع نهاري';
    }
  }

  // زر تعدد اللغات مع ترجمة النصوص
  var langBtn = document.getElementById('toggleLang');
  if (langBtn) {
    langBtn.addEventListener('click', function() {
      var html = document.documentElement;
      var isArabic = html.lang === 'ar';
      html.lang = isArabic ? 'en' : 'ar';
      html.dir = isArabic ? 'ltr' : 'rtl';
      // ترجمة النصوص الأساسية
      var translations = {
        ar: {
          title: 'المستشار المهني الذكي | AI Career Advisor',
          mainTitle: 'اكتشف مستقبلك المهني بالذكاء الاصطناعي',
          mainDesc: 'منصة ذكية تساعدك على اختيار التخصص والمسار المهني الأنسب لك',
          startTest: 'ابدأ الاختبار',
          features: 'مميزات المنصة',
          testimonials: 'آراء المستخدمين',
          share: 'مشاركة النتائج',
          cv: 'أنشئ سيرتك الذاتية',
          footer: '© 2026 المستشار المهني الذكي | جميع الحقوق محفوظة',
        },
        en: {
          title: 'AI Career Advisor | المستشار المهني الذكي',
          mainTitle: 'Discover Your Career Future with AI',
          mainDesc: 'A smart platform to help you choose the best major and career path',
          startTest: 'Start Test',
          features: 'Platform Features',
          testimonials: 'User Testimonials',
          share: 'Share Results',
          cv: 'Create Your CV',
          footer: '© 2026 AI Career Advisor | All rights reserved',
        }
      };
      var t = translations[isArabic ? 'en' : 'ar'];
      document.title = t.title;
      var el;
      el = document.querySelector('h1.display-4'); if(el) el.textContent = t.mainTitle;
      el = document.querySelector('p.lead'); if(el) el.textContent = t.mainDesc;
      el = document.querySelector('a.btn.btn-light'); if(el) el.textContent = t.startTest;
      el = document.querySelector('h2.fw-bold'); if(el) el.textContent = t.features;
      el = document.querySelector('h2.fw-bold.text-center'); if(el) el.textContent = t.testimonials;
      el = document.getElementById('shareResult'); if(el) el.textContent = t.share;
      el = document.querySelector('a.btn.btn-outline-primary.btn-lg'); if(el) el.textContent = t.cv;
      el = document.querySelector('footer p'); if(el) el.textContent = t.footer;
      notify(isArabic ? 'Switched to English' : 'تم التحويل للعربية', 'info');
    });
  }
  // زر "ابدأ الاختبار" في الصفحة الرئيسية
  var startTestBtns = document.querySelectorAll('a[href="career-test.html"]');
  startTestBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      window.location.href = 'career-test.html';
    });
  });

  // زر "ابدأ رحلتك الآن" في الصفحة الرئيسية
  var ctaBtn = document.querySelector('.btn-gradient');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', function(e) {
      window.location.href = 'career-test.html';
    });
  }

  // أزرار لوحة المستخدم
  var dashboardLinks = {
    'results.html': 'results.html',
    'learning-path.html': 'learning-path.html',
    'cv-builder.html': 'cv-builder.html',
    'dashboard.html': 'dashboard.html',
    'admin.html': 'admin.html',
    'login.html': 'login.html',
    'register.html': 'register.html'
  };
  document.querySelectorAll('a').forEach(function(link) {
    var href = link.getAttribute('href');
    if (dashboardLinks[href]) {
      link.addEventListener('click', function(e) {
        window.location.href = href;
      });
    }
  });

  // زر حفظ خطة التعلم PDF (placeholder)
  var savePlanBtn = document.querySelector('button.btn-primary, button.btn-gradient');
  if (savePlanBtn && savePlanBtn.textContent.includes('PDF')) {
    savePlanBtn.addEventListener('click', function(e) {
      e.preventDefault();
      alert('سيتم تفعيل ميزة حفظ PDF قريبًا!');
    });
  }

  // زر إنشاء السيرة الذاتية PDF (فعلي)
  var cvForm = document.querySelector('form');
  if (cvForm && window.location.pathname.includes('cv-builder')) {
    cvForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // جمع البيانات من الحقول
      var name = cvForm.querySelector('input[type="text"]:nth-of-type(1)').value;
      var email = cvForm.querySelector('input[type="email"]').value;
      var education = cvForm.querySelector('input[type="text"]:nth-of-type(2)').value;
      var skills = cvForm.querySelector('input[type="text"]:nth-of-type(3)').value;
      var projects = cvForm.querySelector('input[type="text"]:nth-of-type(4)').value;
      var template = cvForm.querySelector('select').value;

      // إعداد نص السيرة الذاتية
      var content = `الاسم: ${name}\nالبريد الإلكتروني: ${email}\nالتعليم: ${education}\nالمهارات: ${skills}\nالمشاريع: ${projects}\nقالب: ${template}`;

      // توليد PDF باستخدام jsPDF
      if (window.jspdf || window.jspdf?.jsPDF) {
        var doc = new window.jspdf.jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
          putOnlyUsedFonts:true
        });
        doc.setFont('helvetica');
        doc.setFontSize(18);
        doc.text('السيرة الذاتية', 105, 20, {align: 'center'});
        doc.setFontSize(12);
        doc.text(content, 20, 40, {maxWidth: 170, align: 'right'});
        doc.save('CV.pdf');
      } else {
        alert('حدث خطأ في تحميل مكتبة PDF!');
      }
    });
  }

  // زر تسجيل الدخول (placeholder)
  var loginForm = document.querySelector('form');
  if (loginForm && window.location.pathname.includes('login')) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      window.location.href = 'dashboard.html';
    });
  }

  // زر التسجيل (placeholder)
  var registerForm = document.querySelector('form');
  if (registerForm && window.location.pathname.includes('register')) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      window.location.href = 'dashboard.html';
    });
  }

  // زر مشاركة النتائج في صفحة النتائج
  if (window.location.pathname.includes('results')) {
    var shareBtn = document.getElementById('shareResult');
    var shareOptions = document.getElementById('shareOptions');
    if (shareBtn && shareOptions) {
      shareBtn.addEventListener('click', function() {
        shareOptions.style.display = shareOptions.style.display === 'none' ? 'block' : 'none';
      });
      document.getElementById('shareWhatsapp').addEventListener('click', function() {
        var url = window.location.href;
        var text = 'نتائجي في المستشار المهني الذكي: ' + url;
        window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
        notify('تم فتح واتساب للمشاركة!', 'success');
      });
      document.getElementById('shareTwitter').addEventListener('click', function() {
        var url = window.location.href;
        var text = 'نتائجي في المستشار المهني الذكي: ';
        window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url), '_blank');
        notify('تم فتح تويتر للمشاركة!', 'success');
      });
      document.getElementById('copyLink').addEventListener('click', function() {
        navigator.clipboard.writeText(window.location.href);
        notify('تم نسخ رابط النتائج!', 'success');
      });
    }
  }
  // زر اختبار الميول المهنية (نقاط)
  var testForm = document.getElementById('careerTestForm');
  if (testForm) {
    testForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // إضافة نقاط للمستخدم
      var points = parseInt(localStorage.getItem('userPoints') || '0');
      points += 100;
      localStorage.setItem('userPoints', points);
      // إضافة إنجاز
      var achievements = JSON.parse(localStorage.getItem('userAchievements') || '[]');
      if (!achievements.includes('🚀 أول اختبار')) achievements.push('🚀 أول اختبار');
      localStorage.setItem('userAchievements', JSON.stringify(achievements));
      window.location.href = 'results.html';
      notify('تم احتساب نقاطك وإضافة إنجاز جديد!', 'success');
    });
  }

  // عرض النقاط والإنجازات في لوحة المستخدم
  if (window.location.pathname.includes('dashboard')) {
    var points = localStorage.getItem('userPoints') || '0';
    var achievements = JSON.parse(localStorage.getItem('userAchievements') || '[]');
    var pointsDiv = document.getElementById('userPoints');
    var achievementsList = document.getElementById('userAchievements');
    if (pointsDiv) pointsDiv.textContent = points;
    if (achievementsList) {
      achievementsList.innerHTML = '';
      achievements.forEach(function(a){
        var li = document.createElement('li');
        li.textContent = a;
        achievementsList.appendChild(li);
      });
    }
  }
});
