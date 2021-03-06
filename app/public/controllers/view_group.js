/**
 ******************************************************************************
 **%%vim: set modelines=15:
 *
 * public/controllers/view_group.js
 * Controllers: View Group
 *
 * Copyright (c) 2016-2017 Jacob Hipps/Neo-Retro Group, Inc.
 * https://ycnrg.org/
 *
 * @author      Jacob Hipps - jacob@ycnrg.org
 * @license     MPLv2 <https://www.mozilla.org/en-US/MPL/2.0/>
 * @param       vim: set ts=4 sw=4 noexpandtab syntax=javascript:
 *
 *****************************************************************************/

function viewGroupController($scope, $location, $routeParams, $http) {
    console.log("viewGroupController start");

    var template_map = {
        posters: {url: 'views/view_group/posters.html', imgtype: 'poster'}
    };

    $scope._perf_start = Date.now();

    $scope.group = $routeParams.group;
    $scope.groupName = tkconfig.get('groups')[$scope.group];
    $scope.group_list = tkconfig.get('groups');
    $scope.tkconfig = tkconfig;

    // build query string
    var qparam = {groups: {'$in': [$scope.group]}};

    // set default filter & view values
    $scope.viewMode = 'posters';
    $scope.watchOrder = 'title';
    $scope.watchOrderRev = false;
    $scope.watchLimit = null;
    $scope.watchImgType = template_map[$scope.viewMode].imgtype;
    $scope.view_template = template_map[$scope.viewMode].url;

    $scope.showSeriesInfo = function(ser_id) {
        // show info on a bottom or sidebar area, or overlaid on the poster itself
        var tseries, tfanart, season_count;

        try {
            tseries = $scope.serlist.filter(function(x) { return x._id == ser_id; })[0];
            //console.log(`showSeriesInfo: ${ser_id}`);
        } catch(e) {
            console.log(`showSeriesInfo: failed to fetch series '${ser_id}' from serlist`);
            return;
        }

        // get season count; exclude specials (season == 0)
        season_count = _.union(tseries.episodes.map(function(x) { return x.season; })).filter(function(x) { return x; }).length;

        // get fanart
        tfanart = get_selected_image(tseries._imgdata, 'fanart', tseries._id);

        // populate the infobox
        $scope.infobox = {
            title: tseries.title,
            year: (new Date(tseries.tv.debut * 1000)).getFullYear(),
            tv_network: tseries.tv.network,
            genres: tseries.genre.slice(0, 3).join('/'),
            se_count: season_count,
            ep_count: tseries.episodes.length,
            vid_count: tseries._groupdata.length,
            desc: tseries.synopsis[Object.keys(tseries.synopsis)[0]],
            fanart: tfanart
        };

        if(tfanart) {
            var bg_image = 'data:' + tfanart.mimetype + ';base64,' + tfanart.img;
            $('#bg-fanart').css('background-image', 'url('+bg_image+')');
        }

        // show infobox -- set display:fixed and trigger fade-in transition for opacity
        $('#infobox').show();
        $('#infobox').css('opacity', '1.0');
    };

    $scope.selectSeries = function(ser_id) {
        console.log(`selectSeries: ${ser_id}`);
        window.location.hash = `#!/view/${$scope.group}/${ser_id}`;
    };

    $scope.refresh = function() {
        showSplash();
        tkcore.db.query_series_rr(qparam, function(err, rez) {
            logthis.debug("** _perf_time(@query_series_rr) = %d ms", Date.now() - $scope._perf_start);
            logthis.debug2("query_series_rr returned:", rez);

            // create image list
            $scope.imglist = {};
            for(tser in rez) {
                try {
                    var timg = get_selected_image(rez[tser]._imgdata, $scope.watchImgType, rez[tser]._id);
                    $scope.imglist[rez[tser]._id] = 'data:' + timg.mimetype + ';base64,' + timg.img;
                    logthis.debug("matching %s for %s -> %s", $scope.watchImgType, rez[tser]._id, timg._id);
                } catch(e) {
                    logthis.warning("No matching %s image for %s", $scope.watchImgType, rez[tser]._id);
                    continue;
                }
            }
            logthis.debug("** _perf_time(@get_selected_image) = %d ms", Date.now() - $scope._perf_start);

            $scope.serlist = rez;
            if(!$scope.$$phase) $scope.$apply();
            logthis.debug("** _perf_time(@refresh) = %d ms", Date.now() - $scope._perf_start);
        });
    };

    $scope.$on('group-render-complete', function(evt) {
        for(var sid in $scope.imglist) {
            document.getElementById('imglist__' + sid).src = $scope.imglist[sid];
        }

        hideSplash();

        $scope._perf_stop = Date.now();
        $scope._perf_time = $scope._perf_stop - $scope._perf_start;
        logthis.debug("** _perf_time = %d ms", $scope._perf_time);
    });

    $scope.refresh();
    window.$scope = $scope;
}
