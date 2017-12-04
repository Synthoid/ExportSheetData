---
layout: docs
title: Export Value Arrays
description: Documentation for Export Sheet Data's 'Export value arrays' option.
group: json
---

Export value arrays
-------------------
Export value arrays will export a sheet as a JSON array, with each row being used as a single element of the array, if it only contains one column.

The difference between this and [Export sheet arrays](json/exportsheetarrays.md) is value arrays can contain basic values like numbers, bools, or strings, while sheet arrays will always contain JSON objects as their elements.
