// Install App Prompt for Mobile Devices
// يعرض تنبيه للمستخدمين على الأجهزة المحمولة لتثبيت التطبيق

(function() {
    'use strict';

    // التحقق من أن المستخدم على جهاز محمول
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768 && window.matchMedia('(pointer: coarse)').matches);
    }

    // التحقق من أن التطبيق غير مثبت بالفعل
    function isAppInstalled() {
        // للـ iOS
        if (window.navigator.standalone === true) {
            return true;
        }
        
        // للـ Android/Chrome
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return true;
        }
        
        // للتحقق من localStorage
        if (localStorage.getItem('app-installed') === 'true') {
            return true;
        }
        
        return false;
    }

    // التحقق من أن المستخدم لم يرفض التنبيه مؤخراً
    function shouldShowPrompt() {
        const dismissed = localStorage.getItem('install-prompt-dismissed');
        if (!dismissed) return true;
        
        const dismissedDate = new Date(dismissed);
        const daysSinceDismissed = (new Date() - dismissedDate) / (1000 * 60 * 60 * 24);
        
        // إظهار التنبيه مرة أخرى بعد 7 أيام
        return daysSinceDismissed >= 7;
    }

    // إنشاء عنصر التنبيه
    function createInstallPrompt() {
        // التحقق من وجود التنبيه مسبقاً
        if (document.getElementById('install-prompt')) {
            return;
        }

        const prompt = document.createElement('div');
        prompt.id = 'install-prompt';
        prompt.className = 'install-prompt';
        
        // تحديد نوع الجهاز لإظهار التعليمات المناسبة
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        let instructions = '';
        if (isIOS) {
            instructions = `
                <div class="install-instructions">
                    <p class="install-title">📱 ثبّت التطبيق على الشاشة الرئيسية</p>
                    <ol class="install-steps">
                        <li>اضغط على زر <strong>المشاركة</strong> <span class="ios-share">⎋</span> في أسفل الشاشة</li>
                        <li>اختر <strong>"إضافة إلى الشاشة الرئيسية"</strong></li>
                        <li>اضغط <strong>"إضافة"</strong> في الزاوية العلوية</li>
                    </ol>
                </div>
            `;
        } else if (isAndroid) {
            instructions = `
                <div class="install-instructions">
                    <p class="install-title">📱 ثبّت التطبيق على الشاشة الرئيسية</p>
                    <ol class="install-steps">
                        <li>اضغط على قائمة المتصفح <span class="android-menu">☰</span></li>
                        <li>اختر <strong>"إضافة إلى الشاشة الرئيسية"</strong> أو <strong>"تثبيت التطبيق"</strong></li>
                        <li>اضغط <strong>"إضافة"</strong> أو <strong>"تثبيت"</strong></li>
                    </ol>
                </div>
            `;
        } else {
            instructions = `
                <div class="install-instructions">
                    <p class="install-title">📱 ثبّت التطبيق على الشاشة الرئيسية</p>
                    <p class="install-text">للتثبيت، استخدم قائمة المتصفح واختر "إضافة إلى الشاشة الرئيسية"</p>
                </div>
            `;
        }

        prompt.innerHTML = `
            <div class="install-prompt-content">
                ${instructions}
                <div class="install-prompt-actions">
                    <button class="install-btn-primary" id="install-btn">تثبيت الآن</button>
                    <button class="install-btn-secondary" id="dismiss-btn">لاحقاً</button>
                </div>
            </div>
        `;

        document.body.appendChild(prompt);

        // إضافة مستمعي الأحداث
        const installBtn = document.getElementById('install-btn');
        const dismissBtn = document.getElementById('dismiss-btn');

        // زر التثبيت
        if (installBtn) {
            installBtn.addEventListener('click', function() {
                // محاولة استخدام BeforeInstallPrompt API (للمتصفحات المدعومة)
                if (window.deferredPrompt) {
                    window.deferredPrompt.prompt();
                    window.deferredPrompt.userChoice.then(function(choiceResult) {
                        if (choiceResult.outcome === 'accepted') {
                            localStorage.setItem('app-installed', 'true');
                            hidePrompt();
                        }
                        window.deferredPrompt = null;
                    });
                } else {
                    // إذا لم يكن API متاحاً، فقط أخفِ التنبيه
                    hidePrompt();
                }
            });
        }

        // زر الإلغاء
        if (dismissBtn) {
            dismissBtn.addEventListener('click', function() {
                localStorage.setItem('install-prompt-dismissed', new Date().toISOString());
                hidePrompt();
            });
        }

        // إظهار التنبيه بعد تأخير قصير
        setTimeout(function() {
            prompt.classList.add('show');
        }, 1000);
    }

    // إخفاء التنبيه
    function hidePrompt() {
        const prompt = document.getElementById('install-prompt');
        if (prompt) {
            prompt.classList.remove('show');
            setTimeout(function() {
                prompt.remove();
            }, 300);
        }
    }

    // معالجة حدث beforeinstallprompt (للمتصفحات المدعومة)
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        deferredPrompt = e;
        window.deferredPrompt = e;
    });

    // معالجة حدث appinstalled
    window.addEventListener('appinstalled', function() {
        localStorage.setItem('app-installed', 'true');
        hidePrompt();
        deferredPrompt = null;
        window.deferredPrompt = null;
    });

    // تهيئة التنبيه عند تحميل الصفحة
    function initInstallPrompt() {
        if (isMobileDevice() && !isAppInstalled() && shouldShowPrompt()) {
            // انتظر حتى يتم تحميل الصفحة بالكامل
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                    setTimeout(createInstallPrompt, 2000);
                });
            } else {
                setTimeout(createInstallPrompt, 2000);
            }
        }
    }

    // بدء التهيئة
    initInstallPrompt();
})();

