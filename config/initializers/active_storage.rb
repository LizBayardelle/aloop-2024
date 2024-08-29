Rails.application.config.to_prepare do
    ActiveStorage::Current.url_options = Rails.application.routes.default_url_options
end