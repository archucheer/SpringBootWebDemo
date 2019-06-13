package com.example.demo;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

//public class WebConfigfilter extends WebMvcConfigurerAdapter { //Adapter已经过时
@Configuration
public class WebConfigfilter extends WebMvcConfigurationSupport {

    //访问默认首页
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index");
        registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
        super.addViewControllers(registry);
    }

//    //注册拦截器
//    @Override
//    protected void addInterceptors(InterceptorRegistry registry) {
////        registry.addInterceptor()
////                .addPathPatterns("/dataCollect/*")
////                .addPathPatterns("/EchartsMap/*")
////                .addPathPatterns("/Home/*")
////                .excludePathPatterns("/SSO/*"); //不拦截SSO下的控制器
////        //.excludePathPatterns("/Home/*");
//        super.addInterceptors(registry);
//    }


    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
        //文件磁盘静态文件 映射
        //配置server虚拟路径，handler为前台访问的目录，locations为files相对应的本地路径
        super.addResourceHandlers(registry);
    }





}