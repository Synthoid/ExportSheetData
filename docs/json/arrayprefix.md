---
layout: docs
title: Array Prefix
description: Documentation for Export Sheet Data's 'Array prefix' option.
group: json
---

Array prefix
------------
<b>Keys starting with this string will force all cells in the column to be exported as JSON arrays.</b>

This is useful when you may have certain cells with only one value, but you are expecting the element to be a JSON array.

<b>Sheet tabs starting with this string will be exported as a JSON array.</b>

This is useful when you want some sheets to export as JSON arrays while others export as regular JSON blobs.
