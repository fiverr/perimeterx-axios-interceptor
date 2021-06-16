# 1.0.3

## Improvements

### Reinstate existing _pxOnCaptchaSuccess
Superimpose existing _pxOnCaptchaSuccess (when applicable) and reinstate the old one when finished

### Allow UI timeout to be Infinity
To disable abort function for long wait

### Ease in challenge appearance (PerimeterX Human Challenge)
Instead of jumping into appearance - add an open animation for the challenge

<details>
<summary>Visual change</summary>

| Before | After
| - | -
| ![](https://user-images.githubusercontent.com/516342/122932879-05102080-d366-11eb-9be0-d841e4fcf695.gif) | ![](https://user-images.githubusercontent.com/516342/122932930-11947900-d366-11eb-9f2d-3eee1c0e8fe1.gif)

</details>

# 1.0.2

## Bug Fixes

### Fix hiding Google's reCAPTCHA overlay
Modify reCAPTCHA's selector to fix auto-adjust z-index after its appearance

# 1.0.1

## Bug Fixes

### Make sure we're not hiding recaptcha's pedestrain crossing recogniser
In case an element already existed on the page with z-index 2000000000 (which is Google's reCAPTCHA z-index), our modal was showing over it. This observer looks for Google's reCAPTCHA overlay and moves our modal **below** it.
