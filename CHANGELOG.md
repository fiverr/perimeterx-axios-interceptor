# 1.0.2

## Bug Fixes

### Fix hiding Google's reCAPTCHA overlay
Modify reCAPTCHA's selector to fix auto-adjust z-index after its appearance

# 1.0.1

## Bug Fixes

### Make sure we're not hiding recaptcha's pedestrain crossing recogniser
In case an element already existed on the page with z-index 2000000000 (which is Google's reCAPTCHA z-index), our modal was showing over it. This observer looks for Google's reCAPTCHA overlay and moves our modal **below** it.
