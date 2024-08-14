source "https://rubygems.org"

ruby "3.2.2"
gem "rails", "~> 7.1.3", ">= 7.1.3.2"
gem "sprockets-rails"
gem "pg", "~> 1.1"
gem "puma", ">= 5.0"
gem "jsbundling-rails"
gem "stimulus-rails"
gem "cssbundling-rails"
gem "jbuilder"
gem "redis", ">= 4.0.1"
gem "tzinfo-data", platforms: %i[ windows jruby ]
gem "bootsnap", require: false
gem 'active_model_serializers', '~> 0.10.0'

# ESSENTIALS
gem 'devise'
gem 'simple_form'
gem 'friendly_id', '~> 5.2.0'
gem 'invisible_captcha'
gem 'figaro'
gem 'high_voltage', '~> 3.1'

# STYLE STUFF
gem 'font_awesome5_rails'
gem 'tinymce-rails'

# FOR PAYMENTS
gem 'stripe-rails'
gem 'paypal-sdk-rest'
gem 'paypal-checkout-sdk'
gem "money-rails"
gem 'country_select'
gem 'shippo'

# FOR IMAGES
gem 'image_processing', '~> 1.2'
gem 'mini_magick'
gem 'aws-sdk' , '~> 3'
gem 'aws-sdk-s3', require: false

group :development do
  gem 'better_errors'
  gem "web-console"
  gem 'rack-mini-profiler', '~> 2.0'
  gem 'listen', '~> 3.3'
  gem 'spring'
end

group :development, :test do
  gem "debug", platforms: %i[ mri windows ]
end

group :test do
  gem "capybara"
  gem "selenium-webdriver"
end
