module.exports = () => ({
    plugins: [
      require("autoprefixer")(),
    //   require("postcss-px2rem")({ remUnit: 75 })
      require("postcss-pxtorem")({
        rootValue: 37.5,//结果为：设计稿元素尺寸/16，比如元素宽320px,最终页面会换算成 20rem
        propList: ["*"]
      })
    ]
  })