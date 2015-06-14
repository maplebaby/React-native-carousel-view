/**
 * CarouselView 选项卡视图
 */
'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var {
  StyleSheet,
  Text,
  View,
  PixelRatio,
  TouchableWithoutFeedback,
  ScrollView,
} = React;

var CarouselView = React.createClass({

  getDefaultProps() {
    return {
      tabColor: "#999999", // 文字颜色
      tabActiveColor: "#584F60", // 文字选中/border颜色
      tabBackgroundColor: "#FFFFFF", // 背景颜色

      width: Dimensions.get('window').width, // View宽度 

      bottomBorderHidde: false, //底部border显隐
    };
  },

  getInitialState() {
    return {
      activePage: 0,
      switchType: "touch"
    };
  },

  render() {
    return (
      <View
        style={{flex: 1}}>

        <View style={styles.tabCont}>
          {this.renderTabList()}
          <ScrollView
            ref="borderScroll"
            contentContainerStyle={styles.container}
            automaticallyAdjustContentInsets={false}
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            bounces={false}
            scrollEventThrottle={100}>
            {this.renderBottomBorder()}
          </ScrollView>
        </View>

        <ScrollView ref="scrollview"
          contentContainerStyle={styles.container}
          automaticallyAdjustContentInsets={false}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          scrollEventThrottle={100}
          onScroll={this.onViewCarousel}
          onMomentumScrollEnd={this.onViewCarouselEnd}>
          {this.props.children}
        </ScrollView>
      </View>
    );
  },

  /**
   * 切换到第几页
   */
  switchPageTo(index){
    if(this.state.switchType == "click") {
      return true;
    }

    this.setState({
      activePage: index,
      switchType: "click"
    });

    this.refs.borderScroll.scrollTo(0, - index * this.props.width / this.props.children.length);
    this.refs.scrollview.scrollTo(0, index * this.props.width);
  },


  renderBottomBorder() {
    return (
      <View style={{width: this.props.width + this.props.width / this.props.children.length, flex: 1, flexDirection: "row"}}>
        <View style={{ height: 2, width: this.props.width / this.props.children.length, backgroundColor: this.props.tabActiveColor }}></View>
        <View style={{ height: 2, width: this.props.width, backgroundColor: "transparent" }}></View>
      </View>
    );
  },

  renderTabList() {
    var tabTextStyle,
        tabList = [],
        API_LABLE_KEY = "label";

    for (var i=0, len=this.props.children.length; i<len; i++) {
      var text = this.props.children[i].props[API_LABLE_KEY];
      /* 设置颜色 */
      tabTextStyle = i === this.state.activePage ? { color: this.props.tabActiveColor } : { color: this.props.tabColor };

      tabList.push(
        <TouchableWithoutFeedback
          key={i}
          delayLongPress={0}
          onPress={this.switchPageTo.bind(this, i)}>
          <View style={[styles.tabItem, {backgroundColor: this.props.tabBackgroundColor}]}>
            <Text style={[styles.tabText, tabTextStyle]}>{text || "选项卡"}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    }

    return (
      <View style={styles.tabList}>
        {tabList}
      </View>
    );
  },

  onViewCarousel(e) {
    if(this.state.switchType == "default") {
      this.refs.borderScroll.scrollTo(0, - e.nativeEvent.contentOffset.x / this.props.children.length);
    }
  },

  onViewCarouselEnd(e) {
    var activePage = Math.ceil(e.nativeEvent.contentOffset.x / this.props.width);
    this.switchPageTo(activePage);
    this.setState({
      activePage: activePage,
      switchType: "default"
    });
    if (this.props.onPageChange) {
      this.props.onPageChange(activePage);
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },

  tabCont: {
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: "#CCCCCC"
  },
  tabList: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  tabItem: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
  }
});

module.exports = CarouselView;