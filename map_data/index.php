<?php

####################################################################################################################################
####################################[[[ SCROLL TO BOTTOM OF THIS FILE TO CHANGE THE TEMPLATE ]]]####################################
####################################################################################################################################
/*
 *		ALL IN ONE FOLDER/FILE LISTER
 *
 *       Author:    Greg Johnson
 *         Info:    http://greg-j.com/some-url
 *      License:    Creative Commons 3.0
 *                  @ http://creativecommons.org/licenses/by-sa/3.0/us/
 *
 */


/*	Report errors. Ignore pesky notices.
 *	There are a few places this script assumes information is 
 *	available for folders (size, for example) that does not
 *	exist. Let's just make sure you're not reporting notices.
 */
error_reporting(1);
 
 
/**********************************************************************************************************************************/
/*******************************************************************************************************************[ SETTINGS ]***/ 
// Set sorting properties.
$sort = array(
	array('key'=>'lname',	'sort'=>'asc'), // ... this sets the initial sort "column" and order ...
	array('key'=>'size',	'sort'=>'asc') // ... for items with the same initial sort value, sort this way.
);


/**********************************************************************************************************************************/
/*********************************************************************************************************************[ IMAGES ]***/
// Are we requesting an image?
if(isset($_GET['image']))
{
	// Accomidate uppercase & lowercase file extensions
	$image = strtolower($_GET['image']);
	// Set filetypes (most of this list is from http://www.filezed.com)
	$filetype = array(
		'text'		=> array('doc', 'docx', 'txt', 'rtf', 'odf', 'text', 'nfo'),
		'audio'		=> array('aac', 'mp3', 'wav', 'wma', 'm4p'),
		'graphic'	=> array('ai', 'bmp', 'eps', 'gif', 'ico', 'jpg', 'jpeg', 'png', 'psd', 'psp', 'raw', 'tga', 'tif', 'tiff'),
		'video'		=> array('mv4', 'bup', 'mkv', 'ifo', 'flv', 'vob', '3g2', 'bik', 'xvid', 'divx', 'wmv', 'avi', '3gp', 'mp4', 'mov', '3gpp', '3gp2', 'swf'),
		'archive'	=> array('7z', 'dmg', 'rar', 'sit', 'zip', 'bzip', 'gz', 'tar'),
		'app'		=> array('exe', 'msi', 'mse', 'bat'),
		'script'	=> array('js', 'html', 'htm', 'xhtml', 'jsp', 'asp', 'aspx', 'php', 'xml', 'css')
	);

	// Set the mimetype and cache the image for a year
	header("Content-type: image/png");
	header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 60 * 60 *24 * 365) . ' GMT');

	// Deliver the correct image ...
	if($image == '.')									echo base64_decode('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAk1JREFUeNqMU01oE0EU/mY2u22qMSE2UaFKiwdLD0WE+nPx6MFDQfGmBw9evSmKeBE8C/XixZvowR+QXlQQb14KaiAnY9OKjU0Q11hSN012Z8b3JrtJWhBc+JidN+/75nvv7YrKggQ/QuAiLYfwf883Y/CYX1ImjlBgcvLC/bvd5hrC1g+4mSK87ASt+yGkM6A6DioPz91Otiml+0fS230A7tg+GGgSqWPLX8Vm9T1yM/PkUPScui6II/skFoghtYqgux2Ybgh3tIDM5Cm021uoN36h+bsFe07g3IQ37MAxSoFhS7J9EWi1/mAsDLFJyKRdSIoRp19TKtohwDf07UmJIOhgJArtXtFqSIA4DvWM+0YCaiCgVWiTBgoCId2sYlF7RjHisIOjJFCS7CBGStOJjqIhKBKglUQSGNrP3YxuUP4ltdOBiZtkL6dxtfwGCXBZSQldGqnARruduNgmQA7olrgErr/07hnGD58kYgTPc2wJkr6JZhCwQMrmfVoFb2yAbasY/B5ycCRjRXO7XLsawpWVvTafefL6I42PJNKJhNebcxgjQsQ90VEPcXlaK/h+YPOZx19U+tYTnd8IsIfnomnIOv4eNDXJdbxtkBC49ir7/HUJL4iX5jpGCfkPK2gU374sH5k9fjCbL+YEidW+fvlZKt8rc63jGXSSZi030HjwRlWYywJNxud1c/VYdWm+vrx0JleYmJ6anpsiM9U7T9Xl0zPSP39C9AUod9D54X+ULC/SfBfXv9dma2u1s1qjQGGf0PnXf/1XgAEADr97lE6is6IAAAAASUVORK5CYII=');
	elseif($image == 'pdf')								echo base64_decode('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHhSURBVDjLjZPLSxtRFIfVZRdWi0oFBf+BrhRx5dKVYKG4tLhRqlgXPmIVJQiC60JCCZYqFHQh7rrQlUK7aVUUfCBRG5RkJpNkkswrM5NEf73n6gxpHujAB/fOvefjnHM5VQCqCPa1MNoZnU/Qxqhx4woE7ZZlpXO53F0+n0c52Dl8Pt/nQkmhoJOCdUWBsvQJ2u4ODMOAwvapVAqSJHGJKIrw+/2uxAmuJgFdMDUVincSxvEBTNOEpmlIp9OIxWJckMlkoOs6AoHAg6RYYNs2kp4RqOvfuIACVFVFPB4vKYn3pFjAykDSOwVta52vqW6nlEQiwTMRBKGygIh9GEDCMwZH6EgoE+qHLMuVBdbfKwjv3yE6Ogjz/PQ/CZVDPSFRRYE4/RHy1y8wry8RGWGSqyC/nM1meX9IQpQV2JKIUH8vrEgYmeAFwuPDCHa9QehtD26HBhCZnYC8ucGzKSsIL8wgsjiH1PYPxL+vQvm5B/3sBMLyIm7GhhCe90BaWykV/Gp+VR9oqPVe9vfBTsruM1HtBKVPmFIUNusBrV3B4ev6bsbyXlPdkbr/u+StHUkxruBPY+0KY8f38oWX/byvNAdluHNLeOxDB+uyQQfPCWZ3NT69BYJWkjxjnB1o9Fv/ASQ5s+ABz8i2AAAAAElFTkSuQmCC');
	elseif(in_array($image, $filetype['text']))			echo base64_decode('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAADoSURBVBgZBcExblNBGAbA2ceegTRBuIKOgiihSZNTcC5LUHAihNJR0kGKCDcYJY6D3/77MdOinTvzAgCw8ysThIvn/VojIyMjIyPP+bS1sUQIV2s95pBDDvmbP/mdkft83tpYguZq5Jh/OeaYh+yzy8hTHvNlaxNNczm+la9OTlar1UdA/+C2A4trRCnD3jS8BB1obq2Gk6GU6QbQAS4BUaYSQAf4bhhKKTFdAzrAOwAxEUAH+KEM01SY3gM6wBsEAQB0gJ+maZoC3gI6iPYaAIBJsiRmHU0AALOeFC3aK2cWAACUXe7+AwO0lc9eTHYTAAAAAElFTkSuQmCC');
	elseif(in_array($image, $filetype['audio']))		echo base64_decode('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAdRJREFUeNqkU89rE1EQ/maz2STbQKTV1AqRWovFBgKCQsFToEfRmxfBP0DwIl56KkUPglfP0lOhBQVpDz305EmpeNAWPAQaSBoDTUuz2SabZN97nRdN0uqmFhz49s3Oj+8x82ZIKYX/EbOrPNwYGKNvGGEcdA0rs32ncc6LnulPva5weChPOc5LMMe4f2YJmn2QFAo/c6nU2JIQyPLvZiBBsegPJIhGk3e2t0vriURyzXHkLSBS+osgHnMRMsPwpY1crnWKIBIhxzQvZnd3yx8N49IrNj0e2APbNjAxYUEpowfPI/i+0SQafaRU40FgCSclHjcwNWWhst+3xWJAq4WyEJbxT4JfdQNXxoA2t4aIA0MdvdZo4NpZz5hQUrxmbDEUQSjLFAiHBDp6uJOcDyTw2000G+6yHXOfT07K9M1p4jIIbnVP1GsHkNInnVxaXQieg/1yUR/ZdCaNvYqeNomjqqPtO9ohvn3AzruXv6PnewTUXSYrlYF9b2Hz6vXU7eHL46hVayjkfsDLf33qfVl+0y5+7y/HiQXsERDRBUreyNDdJy9gDc1wWAX5T4vy89v37NaD4TCqDJdz/CCCqJ4Z/QCM0B/NFYwmw9NknNPbqGMBBgDJpb7OvDYMdwAAAABJRU5ErkJggg==');
	elseif(in_array($image, $filetype['graphic']))		echo base64_decode('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAdlJREFUeNqkkz9v00AYxp9zzvblLnac0lLiUKpmKFKDqGBgQ0KCoQsDCxJVP0A/RAcGRsTMgtQpEh3oF+haNia2qiukCzSlieP4b987d+hIk5Ne2Wf5+d3z/jlWliXmWRbmXPz9wcFrerZn1A94lmXhh+3tz7Oo9/r9XZ6lKSuoDs8/MVgMsGtkiyLJAF0dX1TBKdnuItAjr1kBvH1aQmt5kiTICbB5n8Hl9HMdWFTA2T+gbldiEHgYAY9CYLMDRCmMRmv5NEmY3oSNY6zfW0NLhebkh8vAsleBJiTo3qlgU3IWiAqgtXwaxywvChz9+ILvQmLryRu86L00lh1e2daABQmkOX2j9KRLANJorQGktDk5PUHQDPD1ch8Xl7+wsvQA7YUV3PVbqDs6D2mAygEEpRbn14A4ji1j56KDPyOO8V8H34Y/URenUFJBKQWv4Zloej6BQ6wtdfBs1YXWagDLyEG3/QqO48B1XUgp4XkKQeCbaLVI3FTwqQhS2rCERZ2INMA4MG28ufR4Z9SrKErA2ITeLYzHJc7PcwghzCGPe2UFOBsMajXbxuHHd/85PjQEmKBmO9Ba5m9s7FiNRjjLJBaj0W8aEVBdEeh7cUs9TQSGbN7rfCXAAJNovyFuktgQAAAAAElFTkSuQmCC');
	elseif(in_array($image, $filetype['video']))		echo base64_decode('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAdxJREFUeNqMU81KI0EQ7t9EhNU3CHjw4s0nyLKEnLz5HotP4AP4AAp5B2FZ2BxCDsoKQm57yhIU3Bwig2IwEyczY3fVVo2dTUY3uzb0dHfV91V9XdUjEVF0u90zIUS92WyeineMTqezT8t5o9H4aNgAAHVaJM3To6OTndksAw5MAwFQ8B4RsFKx6vDw4CfhGVsA5gFEMHxJkhTG48dnIgUyiPneWsNEBXwIYzkAO78655BnkZTIjKUzjEZR7r1nol5WoPhDDhGcynvgBMgf2mOaZv7q6tfs7m5MATBgPDLnTwBWQAaOqhnE2cmEee7h5maUpqnzWluG4wvGy6B6oSDcS5F6YD+Z8Pb2IXNOeGMqgqeUxY3Vizq/qAHdkZySFXR7vW9VWqtRFLnBYCBft5BgGSvA0CYzVxCKcr67u5ckycxvbt5nW1ufYJlsjFbt9rHhIpe6EAJwtu+IEvIcnRAWrLWl7EotalB6B3yFYLj0XlMA4a1dW/UQ9b8U9Ki4TkqN1lb/RmaieaMgp5TB8ANR50pxxXGVggrhywomk0nRBSrsNaKKtTYr2YT5EMdxuQv9fv+iVquxIWq1Pm//72+cTqc4HA4vintzIEq+TvuN+cN6x+D2xsR9+i3AAEgKanVYjEzGAAAAAElFTkSuQmCC');
	elseif(in_array($image, $filetype['archive']))		echo base64_decode('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAEUSURBVCjPXdFNSsMAEIbh0Su4teAdIgEvJB5C14K4UexCEFQEKfivtKIIIlYQdKPiDUTRKtb0x6ZJ+volraEJ3+zmycwkMczGzTE3lwkbxeLE5XTqQfTIjhIm6bCy9E/icoOoyR4v7PLDN+8ibxQHxGzE3JBfHrgUalDnQ6BNk1WRFPjs66kDNTxqg0Uh5qYg4IkrjrS9pTWfmvKaBaGaNU4EY+Lpkq88eKZKmTAhbd3i5UFZg0+TzV1d1FZy4FCpJCAQ8DUnA86ZpciiXjbQhK7aObDOGnNsUkra/WRAiQXdvSwWpBkGvQpnbHHMRvqRlCgBqkm/dd2745YbtofafsOcPiiMTc1fzNzHma4O/XLHCtgfTLBbxm6KrMIAAAAASUVORK5CYII=');
	elseif(in_array($image, $filetype['app']))			echo base64_decode('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAFiSURBVBgZpcEhbpRRGIXh99x7IU0asGBJWEIdCLaAqcFiCArFCkjA0KRJF0EF26kkFbVVdEj6/985zJ0wBjfp8ygJD6G3n358fP3m5NvtJscJYBObchEHx6QKJ6SKsnn6eLm7urr5/PP76cU4eXVy/ujouD074hDHd5s6By7GZknb3P7mUH+WNLZGKnx595JDvf96zTQSM92vRYA4lMEEO5RNraHWUDH3FV48f0K5mAYJk5pQQpqIgixaE1JDKtRDd2OsYfJaTKNcTA2IBIIesMAOPdDUGYJSqGYml5lGHHYkSGhAJBBIkAoWREAT3Z3JLqZhF3uS2EloQCQ8xLBxoAEWO7aZxros7EgISIIkwlZCY6s1OlAJTWFal5VppMzUgbAlQcIkiT0DXSI2U2ymYZs9AWJL4n+df3pncsI0bn5dX344W05dhctUFbapZcE2ToiLVHBMbGymS7aUhIdoPNBf7Jjw/gQ77u4AAAAASUVORK5CYII=');
	elseif(in_array($image, $filetype['script']))		echo base64_decode('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJwSURBVDjLjZPdT1JhHMetvyO3/gfLKy+68bLV2qIAq7UyG6IrdRPL5hs2U5FR0MJIAqZlh7BVViI1kkyyiPkCyUtztQYTYbwJE8W+Pc8pjofK1dk+OxfP+X3O83srAVBCIc8eQhmh/B/sJezm4niCsvX19cTm5uZWPp/H3yDnUKvVKr6ELyinwWtra8hkMhzJZBLxeBwrKyusJBwOQ6PRcJJC8K4DJ/dXM04DOswNqNOLybsRo9N6LCy7kUgkEIlEWEE2mwX9iVar/Smhglqd8IREKwya3qhg809gPLgI/XsrOp/IcXVMhqnFSayurv6RElsT6ZCoov5u1fzUVwvcKRdefVuEKRCA3OFHv2MOxtlBdFuaMf/ZhWg0yt4kFAoVCZS3Hd1gkpOwRt9h0LOES3YvamzPcdF7A6rlPrSbpbhP0kmlUmw9YrHYtoDku2T6pEZ/2ICXEQ8kTz+g2TkNceAKKv2nIHachn6qBx1MI5t/Op1mRXzBd31AiRafBp1vZyEcceGCzQ6p24yjEzocGT6LUacS0iExcrkcK6Fsp6AXLRnmFOjyPMIZixPHmAAOGxZQec2OQyo7zpm6cNN6GZ2kK1RAofPAr8GA4oUMrdNNkIw/wPFhDwSjX3Dwlg0CQy96HreiTlcFZsaAjY0NNvh3QUXtHeHcoKMNA7NjqLd8xHmzDzXDRvRO1KHtngTyhzL4SHeooAAnKMxBtUYQbGWa0Dc+AsWzSVy3qkjeItLCFsz4XoNMaRFFAm4SyTXbmQa2YHQSGacR/pAXO+zGFif4JdlHCpShBzstEz+YfJtmt5cnKKWS/1jnAnT1S38AGTynUFUTzJcAAAAASUVORK5CYII=');
	else												echo base64_decode('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABbSURBVCjPzdAxDoAgEERRzsFp95JbGI2ASA2SCOX3Ahtr8tuXTDIO959bCxRfpOitWS5vA+lMJg9JbKCTTmMQ1QS3ThqVQbBBlsbgpXLYE8lHCXrqLptf9km7Dzv+FwGTaznIAAAAAElFTkSuQmCC');
	
	// Exit this script when the correct image has been served
	exit();
}


/**********************************************************************************************************************************/
/************************************************************************************************************[ DIRECTORY LOGIC ]***/
// Get this folder and files name.
$this_script = basename(__FILE__);
$this_folder = str_replace('/'.$this_script, '', $_SERVER['SCRIPT_NAME']);

// Declare vars used beyond this point.
$file_list = array();
$folder_list = array();
$total_size = 0;

// Open the current directory...
if ($handle = opendir('.'))
{
	// ...start scanning through it.
    while (false !== ($file = readdir($handle)))
	{
		// Make sure we don't list this folder, file or their links.
        if ($file != "." && $file != ".." && $file != $this_script)
		{
			// Get file info.
			$stat				=	stat($file); // ... slow, but faster than using filemtime() & filesize() instead.
			$info				=	pathinfo($file);
			// Organize file info.
			$item['name']		=	$info['filename'];
			$item['lname']		=	strtolower($info['filename']);
			$item['ext']		=	$info['extension'];
				if($info['extension'] == '') $item['ext'] = '.';
			$item['bytes']		=	$stat['size'];
			$item['size']		=	bytes_to_string($stat['size'], 2);
			$item['mtime']		=	$stat['mtime'];
			// Add files to the file list...
			if($info['extension'] != '')
			{
				array_push($file_list, $item);
			}
			// ...and folders to the folder list.
			else
			{
				array_push($folder_list, $item);
			}
			// Clear stat() cache to free up memory (not really needed).
			clearstatcache();
			// Add this items file size to this folders total size
			$total_size += $item['bytes'];
        }
    }
	// Close the directory when finished.
    closedir($handle);
}
// Sort folder list.
if($folder_list)
	$folder_list = php_multisort($folder_list, $sort);
// Sort file list.
if($file_list)
	$file_list = php_multisort($file_list, $sort);
// Calculate the total folder size
if($file_list && $folder_list)
	$total_size = bytes_to_string($total_size, 2);

	
/**********************************************************************************************************************************/
/******************************************************************************************************************[ FUNCTIONS ]***/

/**
 *	http://us.php.net/manual/en/function.array-multisort.php#83117
 */
function php_multisort($data,$keys)
{
	foreach ($data as $key => $row)
	{
		foreach ($keys as $k)
		{
			$cols[$k['key']][$key] = $row[$k['key']];
		}
	}
	$idkeys = array_keys($data);
	$i=0;
	foreach ($keys as $k)
	{
		if($i>0){$sort.=',';}
		$sort.='$cols['.$k['key'].']';
		if($k['sort']){$sort.=',SORT_'.strtoupper($k['sort']);}
		if($k['type']){$sort.=',SORT_'.strtoupper($k['type']);}
		$i++;
	}
	$sort .= ',$idkeys';
	$sort = 'array_multisort('.$sort.');';
	eval($sort);
	foreach($idkeys as $idkey)
	{
		$result[$idkey]=$data[$idkey];
	}
	return $result;
} 

/**
 *	@ http://us3.php.net/manual/en/function.filesize.php#84652
 */
function bytes_to_string($size, $precision = 0) {
	$sizes = array('YB', 'ZB', 'EB', 'PB', 'TB', 'GB', 'MB', 'KB', 'Bytes');
	$total = count($sizes);
	while($total-- && $size > 1024) $size /= 1024;
	$return['num'] = round($size, $precision);
	$return['str'] = $sizes[$total];
	return $return;
}

/**
 *	@ http://us.php.net/manual/en/function.time.php#71342
 */
function time_ago($timestamp, $recursive = 0)
{
	$current_time = time();
	$difference = $current_time - $timestamp;
	$periods = array("second", "minute", "hour", "day", "week", "month", "year", "decade");
	$lengths = array(1, 60, 3600, 86400, 604800, 2630880, 31570560, 315705600);
	for ($val = sizeof($lengths) - 1; ($val >= 0) && (($number = $difference / $lengths[$val]) <= 1); $val--);
	if ($val < 0) $val = 0;
	$new_time = $current_time - ($difference % $lengths[$val]);
	$number = floor($number);
	if($number != 1)
	{
		$periods[$val] .= "s";
	}
	$text = sprintf("%d %s ", $number, $periods[$val]);   
	
	if (($recursive == 1) && ($val >= 1) && (($current_time - $new_time) > 0))
	{
		$text .= time_ago($new_time);
	}
	return $text;
}


/**********************************************************************************************************************************/
/*******************************************************************************************************************[ TEMPLATE ]***/
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>PHPDL - PHP Directory Lister</title>
<style type="text/css">
body{
	font-family: "Lucida Grande",Calibri,Arial;
	font-size: 9pt;
	color: #333;
	background: #f8f8f8;
}
a{
	color: #b00;
	font-size: 11pt;
	font-weight: bold;
	text-decoration: none;
}
a:hover{
	color: #000;
}
img{
	vertical-align: bottom;
	padding: 0 3px 0 0;
}
table{
	margin: 0 auto;
	padding: 0;
	width: 600px;
}
	table td{
		padding: 5px;
	}
	thead td{
		padding-left: 0;
		font-family: "Trebuchet MS";
		font-size: 11pt;
		font-weight: bold;
	}
	tbody .folder td{
		border: solid 1px #f8f8f8;
	}
	tbody .file td{
		background: #fff;
		border: solid 1px #ddd;
	}
	tbody .file td.size,
	tbody .file td.time{
		white-space: nowrap;
		width: 1%;
		padding: 5px 10px;
	}
	tbody .file td.size span{
		color: #999;
		font-size: 8pt;
	}
	tbody .file td.time{
		color: #555;
	}
	tfoot td{
		padding: 5px 0;
		color: #777;
		font-size: 8pt;
		background: #f8f8f8;
		border-color: #f8f8f8;
	}
	tfoot td.copy{
		text-align: right;
		white-space: nowrap;
	}
	tfoot td.cc{
		padding: 40px;
		text-align: center;
	}
	tfoot td.cc img{
		padding: 0;
		border: none;
	}
</style>
</head>

<body>
<table cellpadding="0" cellspacing="1">
	<thead>
		<tr>
			<td colspan="3">Directory listing for <?=$this_folder?></td>
		</tr>
	</thead>
	<tfoot>
		<tr>
			<td class="total"><? if($folder_list): ?>This folder has <?=count($file_list)?> files totaling <?=$total_size['num']?> <?=$total_size['str']?> in size<? endif; ?></td>
			<td colspan="2" class="copy"><a target="_blank" href="http://greg-j.com/phpdl/">PHPDL</a> created by <a target="_blank" href="http://greg-j.com">Greg Johnson</a></td>
		</tr>
		<tr>
			<td colspan="3" class="cc"><a target="_blank" href="http://creativecommons.org/licenses/by-sa/3.0/us/"><img src="http://creativecommons.org/images/public/somerights20.png" alt="CC 3.0" /></a></td>
		</tr>
	</tfoot>
	<tbody>
<!-- folders -->
<? if($folder_list): ?>
<? foreach($folder_list as $item) : ?>
		<tr class="folder">
			<td colspan="3" class="name"><img src="<?=$this_script?>?image=<?=$item['ext']?>" alt="<?=$item['ext']?>" /> <a href="<?=$item['name']?>/">./<?=$item['name']?></a></td>
		</tr>
<? endforeach; ?>
<? endif; ?>
<!-- /folders -->
<!-- files -->
<? if($file_list): ?>
<? foreach($file_list as $item) : ?>
		<tr class="file">
			<td class="name"><img src="<?=$this_script?>?image=<?=$item['ext']?>" alt="<?=$item['ext']?>" /> <a href="<?=$item['name']?>.<?=$item['ext']?>"><?=$item['name']?>.<?=$item['ext']?></a></td>
			<td class="size"><?=$item['size']['num']?><span><?=$item['size']['str']?></span></td>
			<td class="time"><?=time_ago($item['mtime'])?> old</td>
		</tr>
<? endforeach; ?>
<? endif; ?>
<!-- /files -->
	</tbody>                          
</table>

</body>
</html>
