---
layout: docs
title: Export Cell Objects
description: Documentation for Export Sheet Data's 'Export cell objects' option.
group: json
---

Export cell objects
-------------------
Export cells that begin with an open brace (`{`) and end with a close brace (`}`) as a JSON object. You can also export cells that begin with an open bracket (`[`) and end with a close bracket (`]`) as a JSON array.

This allows you to pack JSON data into a single cell and export it as a JSON object or array. If your cell value is not properly formatted for JSON, an empty JSON object (`{}`) or array (`[]`) will be exported instead.
