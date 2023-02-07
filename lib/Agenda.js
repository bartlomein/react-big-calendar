"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _addClass = _interopRequireDefault(require("dom-helpers/addClass"));
var _removeClass = _interopRequireDefault(require("dom-helpers/removeClass"));
var _scrollbarSize = _interopRequireDefault(require("dom-helpers/scrollbarSize"));
var _constants = require("./utils/constants");
var _eventLevels = require("./utils/eventLevels");
var _selection = require("./utils/selection");
function Agenda(_ref) {
  var accessors = _ref.accessors,
    components = _ref.components,
    date = _ref.date,
    events = _ref.events,
    getters = _ref.getters,
    length = _ref.length,
    localizer = _ref.localizer,
    onDoubleClickEvent = _ref.onDoubleClickEvent,
    onSelectEvent = _ref.onSelectEvent,
    selected = _ref.selected;
  var headerRef = (0, _react.useRef)(null);
  var dateColRef = (0, _react.useRef)(null);
  var timeColRef = (0, _react.useRef)(null);
  var contentRef = (0, _react.useRef)(null);
  var tbodyRef = (0, _react.useRef)(null);
  var eventRef = (0, _react.useRef)(null);
  var actualRef = (0, _react.useRef)(null);
  var estimateRef = (0, _react.useRef)(null);
  var changeRef = (0, _react.useRef)(null);
  var previousRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    _adjustHeader();
  });
  var renderDay = function renderDay(day, events, dayKey) {
    var Event = components.event,
      AgendaDate = components.date;
    events = events.filter(function (e) {
      return (0, _eventLevels.inRange)(e, localizer.startOf(day, 'day'), localizer.endOf(day, 'day'), accessors, localizer);
    });
    return events.map(function (event, idx) {
      var _event$actual, _event$estimate, _event$change, _event$previous;
      var title = accessors.title(event);
      var end = accessors.end(event);
      var start = accessors.start(event);
      var userProps = getters.eventProp(event, start, end, (0, _selection.isSelected)(event, selected));
      var dateLabel = idx === 0 && localizer.format(day, 'agendaDateFormat');
      var first = idx === 0 ? /*#__PURE__*/_react.default.createElement("td", {
        rowSpan: events.length,
        className: "rbc-agenda-date-cell"
      }, AgendaDate ? /*#__PURE__*/_react.default.createElement(AgendaDate, {
        day: day,
        label: dateLabel
      }) : dateLabel) : false;
      return /*#__PURE__*/_react.default.createElement("div", {
        key: dayKey + '_' + idx,
        className: "agenda-grid-top-header ".concat(first && "agenda-topLine"),
        style: userProps.style
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "agenda-day-container"
      }, first && /*#__PURE__*/_react.default.createElement("span", {
        className: "agenda-day"
      }, first)), /*#__PURE__*/_react.default.createElement("div", {
        className: "rbc-agenda-time-cell"
      }, timeRangeLabel(day, event)), /*#__PURE__*/_react.default.createElement("div", {
        className: "rbc-agenda-event-cell",
        onClick: function onClick(e) {
          return onSelectEvent && onSelectEvent(event, e);
        },
        onDoubleClick: function onDoubleClick(e) {
          return onDoubleClickEvent && onDoubleClickEvent(event, e);
        }
      }, Event ? /*#__PURE__*/_react.default.createElement(Event, {
        event: event,
        title: title
      }) : title), /*#__PURE__*/_react.default.createElement("div", {
        className: "".concat(event !== null && event !== void 0 && event.actual ? "agenda-actual" : "actual-empty")
      }, event !== null && event !== void 0 && event.actual ? event === null || event === void 0 ? void 0 : (_event$actual = event.actual) === null || _event$actual === void 0 ? void 0 : _event$actual.toFixed(2) : '-'), /*#__PURE__*/_react.default.createElement("div", {
        className: "".concat(event !== null && event !== void 0 && event.estimate ? "agenda-estimate" : "estimate-empty")
      }, event !== null && event !== void 0 && event.estimate ? event === null || event === void 0 ? void 0 : (_event$estimate = event.estimate) === null || _event$estimate === void 0 ? void 0 : _event$estimate.toFixed(2) : '-'), /*#__PURE__*/_react.default.createElement("div", {
        className: "".concat(event !== null && event !== void 0 && event.change ? "agenda-change" : "change-empty")
      }, event !== null && event !== void 0 && event.change ? event === null || event === void 0 ? void 0 : (_event$change = event.change) === null || _event$change === void 0 ? void 0 : _event$change.toFixed(2) : '-'), /*#__PURE__*/_react.default.createElement("div", {
        className: "".concat(event.previous ? "agenda-prev" : "prev-empty")
      }, event !== null && event !== void 0 && event.previous ? event === null || event === void 0 ? void 0 : (_event$previous = event.previous) === null || _event$previous === void 0 ? void 0 : _event$previous.toFixed(2) : '-'));
    }, []);
  };
  var timeRangeLabel = function timeRangeLabel(day, event) {
    var labelClass = '',
      TimeComponent = components.time,
      label = localizer.messages.allDay;
    var end = accessors.end(event);
    var start = accessors.start(event);
    if (!accessors.allDay(event)) {
      if (localizer.eq(start, end)) {
        label = localizer.format(start, 'agendaTimeFormat');
      } else if (localizer.isSameDate(start)) {
        label = localizer.format({
          start: start
        }, 'agendaTimeRangeFormat');
      } else if (localizer.isSameDate(day, start)) {
        label = localizer.format(start, 'agendaTimeFormat');
      } else if (localizer.isSameDate(day)) {
        // label = localizer.format(end, 'agendaTimeFormat')
      }
    }
    if (localizer.gt(day, start, 'day')) labelClass = 'rbc-continues-prior';
    if (localizer.lt(day, end, 'day')) labelClass += ' rbc-continues-after';
    return /*#__PURE__*/_react.default.createElement("span", {
      className: labelClass.trim()
    }, TimeComponent ? /*#__PURE__*/_react.default.createElement(TimeComponent, {
      event: event,
      day: day,
      label: label
    }) : label);
  };
  var _adjustHeader = function _adjustHeader() {
    if (!tbodyRef.current) return;
    var header = headerRef.current;
    var firstRow = tbodyRef.current.firstChild;
    if (!firstRow) return;
    var isOverflowing = contentRef.current.scrollHeight > contentRef.current.clientHeight;

    // dateColRef.current.style.width = _widths[0] + 'px'
    // timeColRef.current.style.width = _widths[1] + 'px'
    // eventRef.current.style.width = _widths[2] + 'px'
    // actualRef.current.style.width = _widths[3] + 'px'
    // estimateRef.current.style.width = _widths[4] + 'px'
    // changeRef.current.style.width = _widths[5] + 'px'
    // previousRef.current.style.width = _widths[6] + 'px'

    if (isOverflowing) {
      (0, _addClass.default)(header, 'rbc-header-overflowing');
      header.style.marginRight = (0, _scrollbarSize.default)() + 'px';
    } else {
      (0, _removeClass.default)(header, 'rbc-header-overflowing');
    }
  };
  var messages = localizer.messages;
  var end = localizer.add(date, length, 'day');
  var range = localizer.range(date, end, 'day');
  events = events.filter(function (event) {
    return (0, _eventLevels.inRange)(event, localizer.startOf(date, 'day'), localizer.endOf(end, 'day'), accessors, localizer);
  });
  events.sort(function (a, b) {
    return +accessors.start(a) - +accessors.start(b);
  });
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "rbc-agenda-view"
  }, events.length !== 0 ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    ref: headerRef,
    className: "rbc-agenda-table "
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    className: "agenda-grid-top-header"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "rbc-header",
    ref: dateColRef
  }, messages.date), /*#__PURE__*/_react.default.createElement("div", {
    className: "rbc-header",
    ref: timeColRef
  }, messages.time), /*#__PURE__*/_react.default.createElement("div", {
    className: "rbc-header",
    ref: eventRef
  }, messages.event), /*#__PURE__*/_react.default.createElement("div", {
    className: "rbc-header agenda",
    ref: actualRef
  }, "Actual"), /*#__PURE__*/_react.default.createElement("div", {
    className: "rbc-header agenda",
    ref: estimateRef
  }, "Est"), /*#__PURE__*/_react.default.createElement("div", {
    className: "rbc-header agenda",
    ref: changeRef
  }, "Change"), /*#__PURE__*/_react.default.createElement("div", {
    className: "rbc-header agenda",
    ref: previousRef
  }, "Prev")))), /*#__PURE__*/_react.default.createElement("div", {
    className: "rbc-agenda-content",
    ref: contentRef
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "rbc-agenda-table"
  }, /*#__PURE__*/_react.default.createElement("div", {
    ref: tbodyRef
  }, range.map(function (day, idx) {
    return renderDay(day, events, idx);
  }))))) : /*#__PURE__*/_react.default.createElement("span", {
    className: "rbc-agenda-empty"
  }, messages.noEventsInRange));
}
Agenda.defaultProps = {
  length: 30
};
Agenda.range = function (start, _ref2) {
  var _ref2$length = _ref2.length,
    length = _ref2$length === void 0 ? Agenda.defaultProps.length : _ref2$length,
    localizer = _ref2.localizer;
  var end = localizer.add(start, length, 'day');
  return {
    start: start,
    end: end
  };
};
Agenda.navigate = function (date, action, _ref3) {
  var _ref3$length = _ref3.length,
    length = _ref3$length === void 0 ? Agenda.defaultProps.length : _ref3$length,
    localizer = _ref3.localizer;
  switch (action) {
    case _constants.navigate.PREVIOUS:
      return localizer.add(date, -length, 'day');
    case _constants.navigate.NEXT:
      return localizer.add(date, length, 'day');
    default:
      return date;
  }
};
Agenda.title = function (start, _ref4) {
  var _ref4$length = _ref4.length,
    length = _ref4$length === void 0 ? Agenda.defaultProps.length : _ref4$length,
    localizer = _ref4.localizer;
  var end = localizer.add(start, length, 'day');
  return localizer.format({
    start: start,
    end: end
  }, 'agendaHeaderFormat');
};
var _default = Agenda;
exports.default = _default;