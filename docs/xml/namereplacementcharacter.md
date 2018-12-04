---
layout: docs
title: Name Replacement Character
description: Documentation for Export Sheet Data's 'Name replacement character' option.
group: xml
---

Name replacement character
--------------------------
Specifies the character that replaces illegal characters in XML element names.

XML element names can only contain a certain set of characters. Escaping illegal characters is not enough for element names, so ESD will instead replace illegal characters with a valid one.

There are three possible replacement characters:

- Underscore (` _ `)
- Dash (` - `)
- Dot (` . `)

For example, the value `T'Pau` would create the XML element `<T_Pau />` if Underscore is selected as the replacement character.
