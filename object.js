Object.mergePres = function(t, s){ // Preserves existing values
  // Do nothing if they're the same object
  if (t === s) {
      return t;
  }

  // Loop through source's own enumerable properties
  Object.keys(s).forEach(function(key) {
    // Get the value
    var val = s[key];

    // Is it a non-null object reference?
    if (val !== null && typeof val === "object") {
      // Yes, if it doesn't exist yet on target, create it
      if (!t.hasOwnProperty(key)) {
        if (val.constructor == Array) t[key] = [];
        else t[key] = {};
      }

      // Recurse into that object
      Object.mergePres(t[key], s[key]);

    // Not a non-null object ref, copy if target doesn't have it
    } else if (!t.hasOwnProperty(key)) {
      t[key] = s[key];
    }
  });
  return t;
}

Object.mergeOver = function(t, s){ // Overwrites existing values
  // Do nothing if they're the same object
  if (t === s) {
      return t;
  }

  // Loop through source's own enumerable properties
  Object.keys(s).forEach(function(key) {
    // Get the value
    var val = s[key];

    // Is it a non-null object reference?
    if (val !== null && typeof val === "object") {
      // Yes, if it doesn't exist yet on target, create it
      if (val.constructor == Array) t[key] = [];
      else t[key] = {};

      // Recurse into that object
      Object.mergeOver(t[key], s[key]);

    // Not a non-null object ref, copy if target doesn't have it
    } else {
      t[key] = s[key];
    }
  });
  return t;
}

Object.clone = function (s) {
  return Object.mergeOver({},s);
}

function split_Clone(t, s){ // Overwrites existing values
  // Do nothing if they're the same object
  if (t === s) {
      return t;
  }

  var validKeys = ["allSplits","attr","bestSplit","finalAlterElement","floodLength","floodStart","form","formElement","split","splitTest","typeId"];
  // Loop through source's own enumerable properties
  Object.keys(s).forEach(function(key) {
    // Get the value
    var val = s[key];

    if (validKeys.binSrch(key) != -1) {
    // Is it a non-null object reference?
      if (val !== null && typeof val === "object") {
        // Yes, if it doesn't exist yet on target, create it
        if (val.constructor == Array) t[key] = [];
        else t[key] = {};

        // Recurse into that object
        Object.mergeOver(t[key], s[key]);

      // Not a non-null object ref, copy if target doesn't have it
      } else {
        t[key] = s[key];
      }
    }
  });
  return t;
}