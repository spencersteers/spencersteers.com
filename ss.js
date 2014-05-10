(function ($) {
  $.fn.getTextWidth = function() {
    var spanText = $("BODY #spanCalculateTextWidth");

    if (spanText.size() <= 0) {
      spanText = $("<span id='spanCalculateTextWidth' style='filter: alpha(0);'></span>");
      spanText.appendTo("BODY");
    }

    var valu = this.val();
    if (!valu) valu = this.text();

    spanText.text(valu);

    spanText.css({
      "fontSize": this.css('fontSize'),
      "fontWeight": this.css('fontWeight'),
      "fontFamily": this.css('fontFamily'),
      "position": "absolute",
      "top": 0,
      "opacity": 0,
      "left": -2000
    });

    return spanText.outerWidth() + parseInt(this.css('paddingLeft')) + 'px';
  };

  $.fn.getTextHeight = function(width) {
    var spanText = $("BODY #spanCalculateTextHeight");

    if (spanText.size() <= 0) {
      spanText = $("<span id='spanCalculateTextHeight'></span>");
      spanText.appendTo("BODY");
    }

    var valu = this.val();
    if (!valu) valu = this.text();

    spanText.text(valu);

    spanText.css({
      "fontSize": this.css('fontSize'),
      "fontWeight": this.css('fontWeight'),
      "fontFamily": this.css('fontFamily'),
      "top": 0,
      "left": -1 * parseInt(width) + 'px',
      "position": 'absolute',
      "display": "inline-block",
      "width": width
    });

    return spanText.innerHeight() + 'px';
  };

  /**
   * Adjust the font-size of the text so it fits the container.
   *
   * @param minSize     Minimum font size?
   * @param maxSize     Maximum font size?
   * @param truncate    Truncate text after sizing to make sure it fits?
   */
  $.fn.autoTextSize = function(minSize, maxSize, truncate) {
    var _self = this,
        _width = _self.innerWidth(),
        _textWidth = parseInt(_self.getTextWidth()),
        _fontSize = parseInt(_self.css('font-size'));

    while (_width < _textWidth || (maxSize && _fontSize > parseInt(maxSize))) {
      if (minSize && _fontSize <= parseInt(minSize)) break;

      _fontSize--;
      _self.css('font-size', _fontSize + 'px');

      _textWidth = parseInt(_self.getTextWidth());
    }

    if (truncate) _self.autoTruncateText();
  };

  /**
   * Function that truncates the text inside a container according to the
   * width and height of that container. In other words, makes it fit by chopping
   * off characters and adding '...'.
   */
  $.fn.autoTruncateText = function() {
    var _self = this,
        _width = _self.outerWidth(),
        _textHeight = parseInt(_self.getTextHeight(_width)),
        _text = _self.text();

    // As long as the height of the text is higher than that
    // of the container, we'll keep removing a character.
    while (_textHeight > _self.outerHeight()) {
      _text = _text.slice(0,-1);
      _self.text(_text);
      _textHeight = parseInt(_self.getTextHeight(_width));
      _truncated = true;
    }

    // When we actually truncated the text, we'll remove the last
    // 3 characters and replace it with '...'.
    if (!_truncated) return;
    _text = _text.slice(0, -3);

    // Make sure there is no dot or space right in front of '...'.
    var lastChar = _text[_text.length - 1];
    if (lastChar == ' ' || lastChar == '.') _text = _text.slice(0, -1);
    _self.text(_text + '...');
  };
})(jQuery);

var screen_height = window.innerHeight;
var screen_width = window.innerWidth;
$('#text').height(screen_height);
$('#about').height(screen_height); 

$(function() {
  $('#text').append('<div class="selfevident last">SPENCERSTEERS</div>');
  $('#text .selfevident.last').autoTextSize(40, screen_width, false);
  
  var max_font_size_px = parseInt($('.selfevident.last').css('font-size'), 10);
  var max_font_size_em = max_font_size_px / 16;

  $('#about h1').autoTextSize(40, screen_width, false);//css('font-size', max_font_size_px);

  var max_count = 65;
  var font_step = (max_font_size_px - 11) / max_count;
  
  var a = 0;
  var append_array = [];
  for (var i = 0 ; i < max_count; i++) {
    append_array[a++] = '<span class="selfevident" style="font-size:';
    append_array[a++] = (i * font_step) + 11;
    append_array[a++] = 'px; top:';
    append_array[a++] = i;
    // append_array[a++] = '%; left:';
    // append_array[a++] = i % 2;
    // append_array[a++] = '%; color:rgba(0,0,0,';
    // append_array[a++] = (i / max_count);
    append_array[a++] = '%;">';
    append_array[a++] = 'SPENCERSTEERS</span>';
  }
  $('.selfevident.last').before((append_array.join('')));

  $("#about").first().css("padding-top",  (screen_height - $("#about .links").first().height()) / 2);
});

$("a[href='#bottom']").click(function() {
  $("html, body").animate({ scrollTop: $(document).height() }, "fast");
  return false;
});