/**
 ******************************************************************************
 **`%vim: set modelines=15:
 *
 * utils.js
 * Utility functions and constants
 *
 * Copyright (c) 2017 Jacob Hipps/Neo-Retro Group, Inc.
 * https://ycnrg.org/
 *
 * @author      Jacob Hipps - jacob@ycnrg.org
 * @license     MPLv2 <https://www.mozilla.org/en-US/MPL/2.0/>
 * @param       vim: set ts=4 sw=4 noexpandtab syntax=javascript:
 *
 *****************************************************************************/

// SMPTE color bars
exports.color_bars = {
    mimetype: "image/png",
    img: "iVBORw0KGgoAAAANSUhEUgAAB6kAAARPCAYAAABNvNQgAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOIwAADiMBj1VACgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHic7NmhTYNRGIbRXnQVAsMcIMsAZQYkqaG7QHAMQ+pIOkcNAhSWnx1o8vwpnDPBa25y8z1js9lMC+DPWK/XhzHG5dw74FSN8bybprebuXfAKfsc5+8P09PF3Dvg1E3Tdj/Gx9XcO+CUrXar/f3LvXcERxrT3fs0vv3v4AiPi+1uv7h2b4BfWi6/Dre3r+7e8IeczT0AAAAAAAAAgP9DpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgN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EakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAAAAgI1IDAAAAAAAAkBGpAQAAAAAAAMiI1AAAAAAAAABkRGoAAAAAAAAAMiI1AAAAAAAAABmRGgAAAAAAAICMSA0AAAAAAABARqQGAAAAAAAAICNSAwAAAAAAAJARqQEAAAAAAADIiNQAAAAAAAAAZERqAAAAAAAAADIiNQAAAAAAAAAZkRoAAAAAAACAjEgNAAAAAAAAQEakBgAAAAAAACAjUgMAAAAAAACQEakBAAAAAAAAyIjUAAAAAAAAAGREagAAAAAAAAAyIjUAAAAAAAAAGZEaAAAAAAAAgIxIDQAAAAAAAEBGpAYAAAAAgH+3Z8cCAAAAAIP8rWexqzQCADaSGgAAAAAAAICNpAYAAAAAAABgI6kBAAAAAAAA2EhqAAAAAAAAADaSGgAAAAAAAICNpAYAAAAAAABgI6kBAAAAAAAA2EhqAAAAAAAAADaSGgAAAAAAAICNpAYAAAAAAABgI6kBAAAAAAAA2EhqAAAAAAAAADaSGgAAAAAAAICNpAYAAAAAAABgI6kBAAAAAAAA2EhqAAAAAAAAADaSGgAAAAAAAICNpAYAAAAAAABgI6kBAAAAAAAA2EhqAAAAAAAAADaSGgAAAAAAAICNpAYAAAAAAABgI6kBAAAAAAAA2EhqAAAAAAAAADaSGgAAAAAAAICNpAYAAAAAAABgI6kBAAAAAAAA2EhqAAAAAAAAADaSGgAAAAAAAICNpAYAAAAAAABgI6kBAAAAAAAA2EhqAAAAAAAAADaSGgAAAAAAAICNpAYAAAAAAABgI6kBAAAAAAAA2EhqAAAAAAAAADaSGgAAAAAAAICNpAYAAAAAAABgI6kBAAAAAAAA2EhqAAAAAAAAADaSGgAAAAAAAICNpAYAAAAAAABgI6kBAAAAAAAA2EhqAAAAAAAAADaSGgAAAAAAAICNpAYAAAAAAABgI6kBAAAAAAAA2EhqAAAAAAAAADaSGgAAAAAAAICNpAYAAAAAAABgI6kBAAAAAAAA2EhqAAAAAAAAADaSGgAAAAAAAICNpAYAAAAAAABgI6kBAAAAAAAA2EhqAAAAAAAAADaSGgAAAAAAAICNpAYAAAAAAABgI6kBAAAAAAAA2EhqAAAAAAAAADaSGgAAAAAAAICNpAYAAAAAAABgE2vz8FCFd50yAAAAAElFTkSuQmCC"
};