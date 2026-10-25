import Foundation
import AppKit
import PDFKit

// Run from the paper root: swift -module-cache-path /private/tmp/unispark-swift-cache website/scripts/prepare-assets.swift
let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let output = root.appendingPathComponent("website/assets")
let fm = FileManager.default
try fm.createDirectory(at: output, withIntermediateDirectories: true)
func save(_ image: NSImage, _ name: String) throws {
    let rep = NSBitmapImageRep(data: image.tiffRepresentation!)!
    try rep.representation(using: .jpeg, properties: [.compressionFactor: 0.84])!.write(to: output.appendingPathComponent(name))
}
let manifest = try JSONSerialization.jsonObject(with: Data(contentsOf: root.appendingPathComponent("website/scripts/asset-map.json"))) as! [String:String]
for (name, path) in manifest.sorted(by: {$0.key < $1.key}) {
    let url = root.appendingPathComponent(path)
    if path.hasSuffix(".pdf") {
        let document = PDFDocument(url: url)!
        let page = document.page(at: 0)!
        let box = page.bounds(for: .mediaBox)
        let image = page.thumbnail(of: NSSize(width: 2200, height: 2200 * box.height / box.width), for: .mediaBox)
        try save(image, name)
        withExtendedLifetime(document) {}
    } else {
        let task = Process()
        task.executableURL = URL(fileURLWithPath: "/usr/bin/sips")
        task.arguments = ["-s", "format", "jpeg", "-s", "formatOptions", "84", "-Z", "1200", url.path, "--out", output.appendingPathComponent(name).path]
        task.standardOutput = FileHandle.nullDevice
        try task.run()
        task.waitUntilExit()
        guard task.terminationStatus == 0 else { fatalError("Image conversion failed: " + path) }
    }
}
print("Prepared \(manifest.count) optimized images.")
