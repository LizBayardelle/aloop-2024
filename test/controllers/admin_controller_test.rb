require "test_helper"

class AdminControllerTest < ActionDispatch::IntegrationTest
  test "should get dashboard" do
    get admin_dashboard_url
    assert_response :success
  end

  test "should get blog" do
    get admin_blog_url
    assert_response :success
  end

  test "should get products" do
    get admin_products_url
    assert_response :success
  end

  test "should get sales" do
    get admin_sales_url
    assert_response :success
  end

  test "should get users" do
    get admin_users_url
    assert_response :success
  end
end
