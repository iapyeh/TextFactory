
\ `繁體中文版`_\ 


.. _h314f6e27113755755fb2358b7d3d65:

Text Factory Help
*****************

Version 2015/2/26

By Yeh, Hsin Yuan

This idea of this google-doc add-on is to save users time by providing several text utilities. With this add-on, users can insert datetime from the pulldown menu directly. It also helps users to add parentheses to selection, add thousands separators to numbers and do conversion between width form of fonts. The datetime format is customizable. It can be used in different cultural context.

.. _he53612f1f39167562133222e366441:

Release Note (Mar 5, 2016)
==========================

    A new version has been updated.

    You can now add a “*” in the format to remove the leading zero. For example, if “%d” yields “02”, then the “%*d” would be “2”. This is also valid for %h, %j, %m,...ect.

.. _h2e5d756ef165210291d424e27125c71:

Insert Date
===========

Inserts the datetime into the document.

.. _h68126c6c7c573911424f1c423561e:

From Menu Item
--------------

.. _h2c1d74277104e41780968148427e:




    You may insert the datetime from the pull-down menu. You have three choices: Yesterday, Today and Tomorrow. Just select the item, the respective datetime value will insert to the document at the cursor position.

    You may change the format of these values by moving up your favorite format item to top in the formats list. You can find the format list in the “Format Editing Form” in sidebar. See “Format Editing” below for details.

.. _h29425c7f697f6b725e2a452f46307b4e:

From Sidebar
------------

\ |IMG1|\ 

    You can bring up the sidebar by the “View more options” menuitem. 

    The “Select Day” is for changing the base day to “yesterday” or “tomorrow” from the default value “ today”.

    The “Select Format” is for choosing proper datetime format in context to insert.

    By clicking on the blue “Insert” button. The item content on the above Selected Format will be inserted into the document.

.. _h64a84323c24d6b105b4427161b2e:

Format Editing
--------------

\ |IMG2|\ 

    By clicking on “Edit Format” \ |IMG3|\     button, the Format Editing Form would show up.

    The selected format item\ |IMG4|\      would appear in the text field

\ |IMG6|\ 

    You may delete the selected format by the \ |IMG7|\     button on the right. But you can not delete them all. If there is only one format left on the list, it can not be deleted.

    You may sort the formats by the \ |IMG8|\ \ |IMG9|\ 
    buttons.  The top format will be used for the three menuitems to generate their datetime value.

    The last item “New Format”\ |IMG10|\      is for adding new format. Just click on this item, then input new format in the text field

.. _h6e29567e5c3e732671b27234d1f19:

Format Text
===========

\ |IMG12|\ 

The functions on this section are applied to text selection. You have to select some text before proceeding. Like this:

\ |IMG13|\ 

.. _h33d6a1d3159173321261d463063536a:

Put into Parentheses
--------------------

    This function add paired symbols to your text selection. For example:

\ |IMG14|\ 

    These are options that you can use to encapsulate your selection. Just click on your favorite symbol to make it happen.

\ |IMG15|\ 

.. _h40f15614e694f744f4c7410d7a7221:

Add Thousands Separator
-----------------------

    This function adds thousands separators into your selection. Only the numbers in the selection would be applied.

.. _h2c1d74277104e41780968148427e:




.. _h1517781f5a4a4d603c1b391a14342f58:

Convert Letter Case
-------------------

    This function converts the letter case in the selection. There are three options: “lower” button converts all alphabets to lowercase, “Title” button converts the first letter to uppercase and the others to lowercase, “UPPER” button converts all alphabets to uppercase.

\ |IMG16|\ 

.. _h2c1d74277104e41780968148427e:




.. _he284078c5f234e1fc4636e11714a:

Conversion of Fullwidth/Halfwidth
---------------------------------

    This function converts the selection between fullwidth and halfwidth form. The fullwidth and halfwidth form is a symbol in two kinds of writing style. The fullwidth form is visually double width than the halfwidth one, in fact, these two are different unicode characters. Below are some characters of halfwidth and fullwidth.

\ |IMG17|\ 

.. _h3f345a39e3924697d39503864754036:

Conversion of Fullwidth/Halfwidth Punctuations
----------------------------------------------

    This function is only available for CJK locale. In context of punctuations, the mappings between fullwidth and halfwidth forms are different. For example, the halfwidth full stop “.” should maps to “。”, not “\ **．**\ ”(this is what the above “Conversion of Fullwidth/Halfwidth” does). This function only converts punctuation symbols in CJK writing traditions. Below is the mapping table of the punctuation conversion:


+----------------------+-------------+------------------------------+-------------+
|Halfwidth To Fullwidth|             |\ **Fullwidth To Halfwidth**\ |             |
+----------------------+-------------+------------------------------+-------------+
|\ **‘**\              |\ **‘**\     |\ **‘**\                      |\ **'**\     |
+----------------------+-------------+------------------------------+-------------+
|\ **“**\              |\ **“**\     |\ **“**\                      |\ **"**\     |
+----------------------+-------------+------------------------------+-------------+
|\ **{T}**\            |\ **｛T｝**\ |\ **｛T｝**\                  |\ **{T}**\   |
+----------------------+-------------+------------------------------+-------------+
|\ **(T)**\            |\ **（T）**\ |\ **（T）**\                  |\ **(T)**\   |
+----------------------+-------------+------------------------------+-------------+
|\ **[T]**\            |\ **［T］**\ |\ **［T］**\                  |\ **[T]**\   |
+----------------------+-------------+------------------------------+-------------+
|\ **[[T]]**\          |\ **『T』**\ |\ **『T』**\                  |\ **[[T]]**\ |
+----------------------+-------------+------------------------------+-------------+
|\ **,**\              |\ **，**\    |\ **，**\                     |\ **,**\     |
+----------------------+-------------+------------------------------+-------------+
|\ **.**\              |\ **。**\    |\ **。**\                     |\ **.**\     |
+----------------------+-------------+------------------------------+-------------+
|\ **..**\             |\ **‥**\     |\ **‥**\                      |\ **..**\    |
+----------------------+-------------+------------------------------+-------------+
|\ **...**\            |\ **…**\     |\ **…**\                      |\ **...**\   |
+----------------------+-------------+------------------------------+-------------+
|\ **<T>**\            |\ **〈T〉**\ |\ **〈T〉**\                  |\ **<T>**\   |
+----------------------+-------------+------------------------------+-------------+
|\ **<<T>>**\          |\ **《T》**\ |\ **《T》**\                  |\ **<<T>>**\ |
+----------------------+-------------+------------------------------+-------------+
|\ **!**\              |\ **！**\    |\ **！**\                     |\ **!**\     |
+----------------------+-------------+------------------------------+-------------+
|\ **?**\              |\ **？**\    |\ **？**\                     |\ **?**\     |
+----------------------+-------------+------------------------------+-------------+
|\ **:**\              |\ **：**\    |\ **：**\                     |\ **:**\     |
+----------------------+-------------+------------------------------+-------------+
|\ **-**\              |\ **—**\     |\ **—**\                      |\ **-**\     |
+----------------------+-------------+------------------------------+-------------+
|\ **;**\              |\ **；**\    |\ **；**\                     |\ **;**\     |
+----------------------+-------------+------------------------------+-------------+
|                      |             |\ **、**\                     |\ **､**\     |
+----------------------+-------------+------------------------------+-------------+
|                      |             |\ **－**\                     |\ **-**\     |
+----------------------+-------------+------------------------------+-------------+
|                      |             |\ **—**\                      |\ **-**\     |
+----------------------+-------------+------------------------------+-------------+

    


.. _h46313855313c357028733469a157d35:

Step-by-Step: How to know what’s wrong by the Chrome Console.
-------------------------------------------------------------

#. Open the Chrome and a Google Docs Document.
#. Open the sidebar of the TextFactory by “View more options”

\ |IMG18|\ 

#. In the sidebar, click the “Edit Format” button on the lower right.

\ |IMG19|\ Then, it would be:

#. Open the javascript console with keyboard shortcut:

    \ **[Before you are going to press on the keyboard, please mouse-click on any empty area in the sidebar again to make sure the sidebar being the focus frame.]**\  

    4.1 For MS Windows users, please open the developer tool  by Ctrl+Shift+J , then click on the tab of “Console”, it would something like this:

\ |IMG21|\ 

    4.2 For Mac OS users, please open the developer tool  by ⌘+Option+J , then click on the tab of “Console”, it would something like this:

\ |IMG22|\ 

#. If something goes wrong, the Google Chrome would drop its complains on the javascript console, like this:

\ |IMG23|\ 

#. please take a screenshot of the console which includes the message on the console as much as possible. 
#. Appreciation! it’s all. Please mail the screenshots to me at \ `iapyeh@gmail.com`_\  

\ **If you have any question about the console, you may consult this document of Google:**\ \ `https://developer.chrome.com/devtools/docs/console`_\ 

\ **Welcome any suggestion and comments. Contacts:**\ \ `iapyeh＠gmail.com`_\ 



.. _`繁體中文版`: https://docs.google.com/document/d/18BgarcV65I72GmQ6NMFPd9kqr7BMjYm-jY_d_jsk2nM/edit?usp=sharing
.. _`iapyeh@gmail.com`: mailto:iapyeh@gmail.com
.. _`https://developer.chrome.com/devtools/docs/console`: https://developer.chrome.com/devtools/docs/console
.. _`iapyeh＠gmail.com`: mailto:iapyeh@gmail.com

.. |IMG1| image:: static/index_1.png
   :height: 332 px
   :width: 325 px
   :align: center

.. |IMG2| image:: static/index_2.png
   :height: 437 px
   :width: 310 px
   :align: center

.. |IMG3| image:: static/index_3.png
   :height: 37 px
   :width: 92 px

.. |IMG4| image:: static/index_4.png
   :height: 30 px
   :width: 29 px

.. |IMG5| image:: static/index_5.png
   :height: 33 px
   :width: 32 px

.. |IMG6| image:: static/index_6.png
   :height: 364 px
   :width: 309 px
   :align: center

.. |IMG7| image:: static/index_7.png
   :height: 21 px
   :width: 26 px

.. |IMG8| image:: static/index_8.png
   :height: 22 px
   :width: 29 px

.. |IMG9| image:: static/index_9.png
   :height: 21 px
   :width: 26 px

.. |IMG10| image:: static/index_10.png
   :height: 30 px
   :width: 26 px

.. |IMG11| image:: static/index_11.png
   :height: 29 px
   :width: 26 px

.. |IMG12| image:: static/index_12.png
   :height: 510 px
   :width: 325 px
   :align: center

.. |IMG13| image:: static/index_13.png
   :height: 166 px
   :width: 337 px
   :align: center

.. |IMG14| image:: static/index_14.png
   :height: 202 px
   :width: 697 px
   :align: center

.. |IMG15| image:: static/index_15.png
   :height: 150 px
   :width: 272 px
   :align: center

.. |IMG16| image:: static/index_16.png
   :height: 212 px
   :width: 450 px
   :align: center

.. |IMG17| image:: static/index_17.png
   :height: 92 px
   :width: 589 px
   :align: center

.. |IMG18| image:: static/index_18.png
   :height: 170 px
   :width: 326 px
   :align: center

.. |IMG19| image:: static/index_19.png
   :height: 241 px
   :width: 232 px

.. |IMG20| image:: static/index_20.png
   :height: 549 px
   :width: 258 px

.. |IMG21| image:: static/index_21.png
   :height: 94 px
   :width: 600 px
   :align: center

.. |IMG22| image:: static/index_22.png
   :height: 196 px
   :width: 598 px

.. |IMG23| image:: static/index_23.png
   :height: 305 px
   :width: 556 px
   :align: center
